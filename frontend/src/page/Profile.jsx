import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image, Code, BookOpen, CheckSquare, Trophy, Star, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";
import StreakCalendar from "../components/StreakCalendar";
import { motion } from "framer-motion";

const Profile = () => {
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("submissions");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-[#060606] flex flex-col items-start py-6 px-4 md:px-8 w-full relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background effects */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606] to-[#0a0a0a]"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform translate-y-1/2"></div>
      </div>
      
      {/* Header with back button */}
      <motion.div 
        className="container mx-auto max-w-6xl mb-6 z-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost text-white hover:bg-blue-500/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>
      </motion.div>
      
      <div className="container mx-auto max-w-6xl z-10">
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Card */}
          <motion.div 
            className="card bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/5 border border-gray-700/30 overflow-hidden rounded-xl"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 h-24"></div>
            <div className="card-body pt-0 relative">
              {/* Avatar */}
              <div className="avatar placeholder absolute -top-12 left-8">
                <div className="bg-[#060606] text-white rounded-full w-24 h-24 ring ring-blue-500 ring-offset-base-100 ring-offset-2 shadow-lg">
                  {authUser.image ? (
                    <img src={authUser?.image || "https://avatar.iran.liara.run/public/boy"} alt={authUser.name} />
                  ) : (
                    <span className="text-3xl">{authUser.name ? authUser.name.charAt(0) : "U"}</span>
                  )}
                </div>
              </div>
              
              {/* Name and Role Badge */}
              <div className="mt-12 md:mt-6 md:ml-28">
                <h2 className="text-2xl font-bold text-white">{authUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">{authUser.role}</div>
                  <div className="text-sm text-gray-400">Member since {new Date().getFullYear()}</div>
                </div>
              </div>
              
              <div className="divider my-4 border-gray-700/50"></div>
              
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all">
                  <Mail className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="font-medium text-white break-all">{authUser.email}</div>
                  </div>
                </div>
                
                {/* User ID */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all">
                  <User className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">User ID</div>
                    <div className="font-medium text-gray-300 text-xs break-all">{authUser.id}</div>
                  </div>
                </div>
                
                {/* Role Status */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all">
                  <Shield className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">Role</div>
                    <div className="font-medium text-white">{authUser.role}</div>
                    <div className="text-xs text-gray-400">
                      {authUser.role === "ADMIN" ? "Full system access" : "Limited access"}
                    </div>
                  </div>
                </div>
                
                {/* Profile Image Status */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all">
                  <Image className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">Profile Image</div>
                    <div className="font-medium text-white">
                      {authUser.image ? "Uploaded" : "Not Set"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {authUser.image ? "Image available" : "Upload a profile picture"}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="card-actions justify-end mt-6">
                <motion.button 
                  className="px-4 py-2 bg-transparent text-blue-400 hover:bg-blue-500/20 border border-blue-500/50 rounded-md text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
                <motion.button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border-0 text-white rounded-md text-sm font-medium shadow-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Password
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Stats and Streak Calendar in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Overview Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-blue-500/5 border border-gray-700/30 p-6"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Stats Overview</h2>
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                    Summary
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30 hover:border-yellow-500/30 transition-all">
                  <div className="bg-yellow-500/10 p-3 rounded-full mr-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.problemsSolved?.length || 0}</div>
                    <div className="text-sm text-gray-400">Problems Solved</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30 hover:border-green-500/30 transition-all">
                  <div className="bg-green-500/10 p-3 rounded-full mr-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.submissions?.length || 0}</div>
                    <div className="text-sm text-gray-400">Submissions</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30 hover:border-purple-500/30 transition-all">
                  <div className="bg-purple-500/10 p-3 rounded-full mr-4">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.playlists?.length || 0}</div>
                    <div className="text-sm text-gray-400">Playlists</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Streak Calendar Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-blue-500/5 border border-gray-700/30 p-6"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Coding Streak</h2>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                    Activity
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center h-full py-2">
                <div className="max-w-md w-full">
                  <StreakCalendar />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Tabs for sections */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-blue-500/5 border border-gray-700/30 overflow-hidden"
            variants={itemVariants}
          >
            <div className="border-b border-gray-700/50">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab("submissions")} 
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "submissions" 
                    ? "border-blue-500 text-blue-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Submissions</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab("problems")} 
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "problems" 
                    ? "border-blue-500 text-blue-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    <span>Problems Solved</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab("playlists")} 
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "playlists" 
                    ? "border-blue-500 text-blue-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Playlists</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* User activity sections */}
            <div className="p-6 text-white">
              {activeTab === "submissions" && <ProfileSubmission />}
              {activeTab === "problems" && <ProblemSolvedByUser />}
              {activeTab === "playlists" && <PlaylistProfile />}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;