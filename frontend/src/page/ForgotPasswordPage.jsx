import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', data);
      console.log('Forgot password response:', res.data);
      
      toast.success(res.data.message || 'Password reset email sent successfully');
      setIsEmailSent(true);
    } catch (error) {
      console.error('Forgot password failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#060606] text-white">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative w-full max-w-lg">
          <div className="w-full max-w-md space-y-6 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mt-3 text-white">Check Your Email</h1>
                <p className="text-gray-300">
                  We've sent a password reset link to <br />
                  <span className="text-blue-400">{getValues('email')}</span>
                </p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg text-center">
              <p className="text-gray-300 mb-6">
                Please check your email and click the reset link to create a new password.
              </p>
              
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                <Mail className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-white">Forgot Password?</h1>
              <p className="text-gray-300">Enter your email to reset your password</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.email.message}</p>
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
                  Sending Email...
                </>
              ) : (
                "Send Reset Email"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
