import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../libs/email.js";
import { OAuth2Client } from "google-auth-library";
import { validateEmail, validatePassword, validateName } from "../utils/validation.js";

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      message: " All fields are required",
    });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      message: passwordValidation.errors[0], // Return first error
    });
  }

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    return res.status(400).json({
      message: nameValidation.error,
    });
  }

  try {
    const existingUser = await db.User.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = await db.User.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
        verificationToken: verificationToken,
        isVerified: false,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, verificationToken);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Don't fail registration if email sending fails
    }

    res.status(201).json({
      message: "User Created Successfully",
      User: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error in creating user", error);
    res.status(500).json({
      error: "Error in creating user",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: " All Fields are required",
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  try {
    const user = await db.User.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    // Check if user has a password (not a Google user)
    if (!user.password || user.password === '') {
      return res.status(401).json({
        message: "Please use Google Sign-In for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const isProduction = process.env.NODE_ENV === 'production';
    // Log the environment detection
    console.log('Environment check - NODE_ENV:', process.env.NODE_ENV, 'isProduction:', isProduction);
    
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      message: "User LoggedIn Successfully",
      User: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error logging in user", error);
    res.status(500).json({
      error: "Error logging in user",
    });
  }
};
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    });
    res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.error("Error Looging Out User", error);
    res.status(500).json({
      message: "User Logged Out Successfully",
    });
  }
};
export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User Authenticated Successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error Checking User", error);
    res.status(500).json({
      message: "Error Checking User",
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Invalid verification link",
      });
    }

    // Find user by verification token
    const user = await db.User.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token or user already verified",
      });
    }

    // Update user verification status
    await db.User.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({
      message: "Error verifying user",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await db.User.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const resetPassToken = crypto.randomBytes(32).toString("hex");
    const resetPassExpiry = new Date(Date.now() + 10 * 60 * 1000); // Use Date object for DateTime field

    await db.User.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: resetPassToken,
        resetPasswordExpires: resetPassExpiry,
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetPassToken);
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      return res.status(500).json({
        message: "Error sending password reset email",
        success: false,
      });
    }

    res.status(200).json({
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({
      message: "Error processing forgot password request",
      success: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetPassToken } = req.params;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (!resetPassToken) {
      return res.status(400).json({
        message: "Invalid password reset token",
      });
    }

    // Find user with valid token that hasn't expired
    const user = await db.User.findFirst({
      where: {
        resetPasswordToken: resetPassToken,
        resetPasswordExpires: {
          gt: new Date(), // Use Prisma's gt operator instead of $gt
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with new password and clear reset token fields
    await db.User.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      message: "Error resetting password",
      success: false,
    });
  }
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body; // coming from Google login on frontend

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;

    let user = await db.User.findUnique({
      where: { email },
    });

    if (!user) {
      // User doesn't exist, create them
      user = await db.User.create({
        data: {
          name,
          email,
          image: picture,
          password: '', // Google users don't need a password
          role: UserRole.USER,
          isVerified: true, // Auto-verify Google users
          googleId,
        },
      });
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId, update it
      user = await db.User.update({
        where: { id: user.id },
        data: {
          googleId,
          isVerified: true,
          image: picture, // Update profile picture
        },
      });
    }

    // Generate JWT token (same as your existing login)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? 'none' : 'lax',
    };

    return res
      .status(200)
      .cookie('jwt', token, cookieOptions)
      .json({
        success: true,
        message: 'Google login successful',
        User: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
    });
  }
};
 