import express from "express";
import {
  check,
  forgotPassword,
  googleAuth,
  login,
  logout,
  register,
  resetPassword,
  verifyUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.get("/verify/:token", verifyUser);
authRoutes.post("/login", login);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset/:resetPassToken", resetPassword);
authRoutes.post("/google-login", googleAuth);
authRoutes.get("/check", authMiddleware, check);

export default authRoutes;
