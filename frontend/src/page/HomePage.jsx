import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-12 px-6">
        <div className="text-center w-full mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">CodeStash</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
            A Platform Inspired by Leetcode which helps you to prepare for coding
            interviews and helps you to improve your coding skills by solving coding
            problems
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">Practice & Solve</div>
                <div className="text-gray-400 text-sm">Challenge yourself with coding problems</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">Real-time Testing</div>
                <div className="text-gray-400 text-sm">Instant feedback on your solutions</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">Track Progress</div>
                <div className="text-gray-400 text-sm">Monitor your coding journey</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className="relative z-10 px-6 pb-12">
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-dashed border-purple-500/30 rounded-xl p-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Problems Available</h3>
              <p className="text-gray-400">Check back later for new coding challenges</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
