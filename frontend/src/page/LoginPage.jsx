import React, {useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link } from 'react-router-dom'
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


const LoginSchema = z.object({
  email:z.string().email("Enter a valid email"),
  password:z.string().min(6 , "Password must be atleast of 6 characters"),

})

const LoginPage = () => {

  const {isLoggingIn , login} = useAuthStore()
  const [showPassword , setShowPassword] = useState(false);

  const {
    register ,
    handleSubmit,
    formState:{errors},
  } = useForm({
    resolver:zodResolver(LoginSchema)
  })

  const onSubmit = async (data)=>{
    try {
      await login(data)
      
    } catch (error) {
      console.error("Signup failed" , error)
    }
  }


  return (
    <div className='h-screen grid lg:grid-cols-2'>
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-900 relative">
          {/* Background effects */}
          <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/5 rounded-full"></div>
            <div className="absolute bottom-40 left-20 w-32 h-32 bg-purple-500/5 rounded-full"></div>
          </div>
          
        <div className="w-full max-w-md space-y-6 z-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                <Code className="w-7 h-7 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold mt-3 text-white">Welcome Back</h1>
              <p className="text-gray-300">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 backdrop-blur-sm bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 shadow-lg">
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
                  className={`w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors ${
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
                  className={`w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors ${
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-2.5 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back to CodeStash!"}
        subtitle={
          "Sign in to continue your coding journey and track your progress."
        }
      />
    </div>
  )
}

export default LoginPage