import React, {useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link, useNavigate } from 'react-router-dom'
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Check,
  X
} from "lucide-react";

import {z} from "zod";
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from "../store/useAuthStore";
import GoogleLoginButton from '../components/GoogleLoginButton';

const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      // Additional email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, "Please enter a valid email address"),
  password: z
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
  name: z.string().min(3, "Name must be at least 3 characters")
})

const SignUpPage = () => {

  const [showPassword , setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {signup , isSigninUp} = useAuthStore()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState:{errors},
    watch
  } = useForm({
    resolver:zodResolver(SignUpSchema)
  })

  // Watch password field for real-time validation feedback
  const watchedPassword = watch("password", "");

  // Password requirements checker
  const getPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const passwordRequirements = getPasswordRequirements(watchedPassword);

  const onSubmit = async (data)=>{
   try {
    await signup(data)
    navigate('/login')
    console.log("signup data" , data)
   } catch (error) {
     console.error("SignUp failed:", error);
   }
  }


  return (
    <div className='min-h-screen flex justify-center items-center bg-[#060606] text-white'>
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative w-full max-w-lg">
          {/* Background effects */}
          <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute top-40 left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-xl"></div>
          </div>
          
        <div className="w-full max-w-md space-y-6 z-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                <Code className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-white">Create Account</h1>
              <p className="text-gray-300">Join our coding community</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 backdrop-blur-sm bg-[#0a0a0a]/80 border border-gray-800 rounded-xl p-8 shadow-lg">
            
            {/* name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                    errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.name.message}</p>
              )}              
            </div>

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

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.password.message}</p>
              )}
              
              {/* Password Requirements */}
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSigninUp}
            >
               {isSigninUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mt-6">
              <div className="border-t border-gray-700 w-full"></div>
              <span className="bg-[#0a0a0a] px-4 text-gray-400 text-sm">or</span>
              <div className="border-t border-gray-700 w-full"></div>
            </div>

            {/* Google Login Button */}
            <div className="mt-4">
              <GoogleLoginButton />
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage