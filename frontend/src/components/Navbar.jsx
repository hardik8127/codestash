import React from "react"
import { User, Code, LogOut, Trophy, BookOpen, Layout as LayoutIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";



const Navbar = () => {
    const { authUser } = useAuthStore();
    
    console.log("AUTH_USER", authUser);
    
    return (
     <nav className="sticky top-0 z-50 w-full py-5 bg-[#060606]">
      <div className="flex w-full justify-between mx-auto max-w-5xl shadow-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700/20 p-4 rounded-2xl">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to={authUser ? "/home" : "/"} className="flex items-center gap-3 cursor-pointer">
            <img src="/codestash-logo.svg" className="h-10 w-10 p-1 rounded-full" />
            <span className="text-lg md:text-xl font-bold tracking-tight text-white hidden md:block">
            CodeStash 
            </span>
          </Link>
        </div>            {/* Navigation Links - Centered - Only show if user is authenticated */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center">
          {authUser ? (
            <div className="flex items-center gap-8">
              <Link to="/problems" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Problems</span>
              </Link>
              <Link to="/contests" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Contests</span>
              </Link>
              <Link to="/sheets" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span className="font-medium">Sheets</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <a href="#features-section" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Features</span>
              </a>
              <a href="#how-it-works" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">How It Works</span>
              </a>
            </div>
          )}
        </div>
          {/* Mobile Navigation Icons - Only show on small screens */}
        <div className="md:hidden flex items-center absolute left-1/2 transform -translate-x-1/2">
          {authUser ? (
            <div className="flex items-center gap-6">
              <Link to="/problems" className="p-2">
                <Code className="w-5 h-5 text-blue-400" />
              </Link>
              <Link to="/contests" className="p-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </Link>
              <Link to="/sheets" className="p-2">
                <BookOpen className="w-5 h-5 text-green-400" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <a href="#features-section" className="p-2">
                <Code className="w-5 h-5 text-blue-400" />
              </a>
              <a href="#how-it-works" className="p-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </a>
            </div>
          )}
        </div>{/* User Profile and Dropdown */}
        <div className="flex items-center gap-4">          {/* Show login/signup buttons if not authenticated */}
          {!authUser ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium">
                Log in
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors font-medium hover:bg-blue-700">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-800/50 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-gray-300 hidden md:inline-block">{authUser?.name?.split(' ')[0]}</span>
              </label>              <ul
                tabIndex={0}
                className="dropdown-content mt-2 z-[1] p-2 shadow-lg bg-gray-800 border border-gray-700 rounded-xl w-56 text-gray-200"
              >
                {/* User Info */}
                <li className="px-3 py-2 border-b border-gray-700">
                  <p className="font-medium text-white">{authUser?.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{authUser?.email}</p>
                </li>
                
                {/* Menu Items */}                <li className="mt-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>My Profile</span>
                  </Link>
                </li>
                
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Code className="w-4 h-4 text-blue-400" />
                      <span>Add Problem</span>
                    </Link>
                  </li>
                )}
                
                <li className="mt-1">
                  <LogoutButton className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 w-full text-left transition-colors">
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Logout</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
    )
}


export default Navbar;