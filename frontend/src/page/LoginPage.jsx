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
} from "lucide-react";

import {z} from "zod";
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';
import GoogleLoginButton from '../components/GoogleLoginButton';


const LoginSchema = z.object({
  email:z.string().email("Enter a valid email"),
  password:z.string().min(6 , "Password must be atleast of 6 characters"),

})

const LoginPage = () => {

  const {isLoggingIn , login} = useAuthStore()
  const [showPassword , setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register ,
    handleSubmit,
    formState:{errors},
  } = useForm({
    resolver:zodResolver(LoginSchema)
  })

  const onSubmit = async (data)=>{
    try {
      const response = await login(data)
      console.log("Login successful:", response)
      navigate('/home')
      
    } catch (error) {
      console.error("Login failed" , error)
    }
  }


  return (
    <div className='min-h-screen flex justify-center items-center bg-[#060606] text-white'>
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
              <h1 className="text-3xl font-bold mt-3 text-white">Welcome Back</h1>
              <p className="text-gray-300">Sign in to your account</p>
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
              
              {/* Forgot Password Link */}
              <div className="flex justify-end mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoggingIn}
            >
               {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Signing in...
                </>
              ) : (
                "Sign in"
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
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage