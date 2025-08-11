import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, X, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter"
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number"
    })
    .refine((password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), {
      message: "Password must contain at least one special character"
    }),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const { changePassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Watch new password field for real-time validation feedback
  const watchedNewPassword = watch("newPassword", "");

  // Password requirements checker
  const getPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const passwordRequirements = getPasswordRequirements(watchedNewPassword);

  const onSubmit = async (data) => {
    setIsChanging(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      reset();
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Current Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-200">Current Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                  errors.currentPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.currentPassword.message}</p>
            )}
          </div>

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
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                  errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.newPassword.message}</p>
            )}

            {/* Password Requirements */}
            {watchedNewPassword && (
              <div className="mt-3 p-3 bg-[#0f0f0f] border border-gray-800 rounded-lg">
                <p className="text-gray-300 text-sm font-medium mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {passwordRequirements.minLength ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${passwordRequirements.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasUppercase ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${passwordRequirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasNumber ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasSpecialChar ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${passwordRequirements.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-200">Confirm New Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChanging}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChanging ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
