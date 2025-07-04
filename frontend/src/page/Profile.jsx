import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image, Code, BookOpen, CheckSquare, Trophy, Star, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";
import StreakCalendar from "../components/StreakCalendar"

const Profile = () => {
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("submissions");
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-start py-6 px-4 md:px-8 w-full">
      {/* Header with back button */}
      <div className="container mx-auto max-w-6xl mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Card */}
          <div className="card bg-gray-800 shadow-lg shadow-purple-500/10 border border-gray-700/20 backdrop-blur-lg overflow-hidden">
            <div className="bg-gray-700 h-24"></div>
            <div className="card-body pt-0 relative">
              {/* Avatar */}
              <div className="avatar placeholder absolute -top-12 left-8">
                <div className="bg-gray-900 text-white rounded-full w-24 h-24 ring ring-blue-500 ring-offset-gray-800 ring-offset-2 shadow-lg">
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
                  <div className="badge bg-blue-500 text-white border-0">{authUser.role}</div>
                  <div className="text-sm text-gray-400">Member since {new Date().getFullYear()}</div>
                </div>
              </div>
              
              <div className="divider my-4 border-gray-700"></div>
              
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <Mail className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="font-medium text-white break-all">{authUser.email}</div>
                  </div>
                </div>
                
                {/* User ID */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <User className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-400">User ID</div>
                    <div className="font-medium text-gray-300 text-xs break-all">{authUser.id}</div>
                  </div>
                </div>
                
                {/* Role Status */}
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
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
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
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
                <button className="btn bg-transparent text-blue-400 hover:bg-blue-500/20 border border-blue-500 btn-sm">Edit Profile</button>
                <button className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white btn-sm">Change Password</button>
              </div>
            </div>
          </div>
          
          {/* Stats and Streak Calendar in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Overview Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg shadow-purple-500/10 border border-gray-700/20 p-4">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-white">Stats Overview</h2>
                <div className="ml-2 badge badge-secondary">Summary</div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30">
                  <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.problemsSolved?.length || 0}</div>
                    <div className="text-sm text-gray-400">Problems Solved</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30">
                  <div className="bg-green-500/10 p-3 rounded-full mr-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.submissions?.length || 0}</div>
                    <div className="text-sm text-gray-400">Submissions</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-900/50 rounded-lg shadow-md border border-gray-700/30">
                  <div className="bg-purple-500/10 p-3 rounded-full mr-4">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{authUser.playlists?.length || 0}</div>
                    <div className="text-sm text-gray-400">Playlists</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Streak Calendar Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg shadow-purple-500/10 border border-gray-700/20 p-4">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-white">Coding Streak</h2>
                <div className="ml-2 badge badge-accent">Activity</div>
              </div>
              <div className="flex justify-center items-center h-full py-2 pb-10">
                <div className="max-w-md w-full">
                  <StreakCalendar />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for sections */}
          <div className="bg-gray-800 rounded-lg shadow-lg shadow-purple-500/10 border border-gray-700/20">
            <div className="border-b border-gray-700">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab("submissions")} 
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === "submissions" 
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
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === "problems" 
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
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === "playlists" 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;