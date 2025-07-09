import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Code, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  // Check if token is valid on component mount
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }
    // Assume token is valid for now - backend will validate it on submission
    setIsValidToken(true);
  }, [token]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/reset/${token}`, {
        password: data.password,
      });
      
      console.log('Reset password response:', response.data);
      toast.success(response.data.message || 'Password reset successful');
      setIsResetComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password failed:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      
      // If token is invalid, show error state
      if (error.response?.status === 400) {
        setIsValidToken(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#060606] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-gray-300">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#060606] text-white">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative w-full max-w-lg">
          <div className="w-full max-w-md space-y-6 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Code className="w-7 h-7 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold mt-3 text-white">Invalid Reset Link</h1>
                <p className="text-gray-300 text-center max-w-sm">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg space-y-4">
              <div className="text-center space-y-4">
                <Link
                  to="/forgot-password"
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg inline-block text-center"
                >
                  Request New Reset Link
                </Link>
                
                <Link
                  to="/login"
                  className="w-full py-3 px-4 border border-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 inline-block text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isResetComplete) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#060606] text-white">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative w-full max-w-lg">
          {/* Background effects */}
          <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute top-40 right-20 w-48 h-48 bg-green-500/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 left-20 w-32 h-32 bg-green-500/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-xl"></div>
          </div>

          <div className="w-full max-w-md space-y-6 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mt-3 text-white">Password Reset!</h1>
                <p className="text-gray-300 text-center max-w-sm">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg">
              <Link
                to="/login"
                className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-md hover:shadow-lg inline-block text-center"
              >
                Continue to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#060606] text-white">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative w-full max-w-lg">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 opacity-60">
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-xl"></div>
        </div>

        <div className="w-full max-w-md space-y-6 z-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                <Code className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-white">Reset Password</h1>
              <p className="text-gray-300 text-center max-w-sm">
                Enter your new password below to reset your account password.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg"
          >
            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
