import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, ChevronRight, Code, Zap, Award } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060606]">
        <Loader className="size-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#060606] text-white relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606] to-[#0a0a0a]"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <motion.div className="relative z-10 flex flex-col items-center pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6" variants={containerVariants}>
        <motion.div className="text-center w-full mx-auto" variants={itemVariants}>
          <motion.h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 relative" variants={itemVariants}>
            Welcome to <span className="text-blue-400">CodeStash</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-blue-500/40 rounded-full"></div>
          </motion.h1>

          <motion.p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-12 px-4" variants={itemVariants}>
            A Platform Inspired by Leetcode which helps you to prepare for coding
            interviews and helps you to improve your coding skills by solving coding
            problems
          </motion.p>

          {/* Feature Highlights */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto" variants={containerVariants}>
            <motion.div 
              className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 hover:bg-gray-700/30 transition-colors shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium">Practice & Solve</div>
                <div className="text-gray-400 text-sm">Challenge yourself with coding problems</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 hover:bg-gray-700/30 transition-colors shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium">Real-time Testing</div>
                <div className="text-gray-400 text-sm">Instant feedback on your solutions</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 hover:bg-gray-700/30 transition-colors shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium">Track Progress</div>
                <div className="text-gray-400 text-sm">Monitor your coding journey</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Problems Section */}
      <motion.div className="relative z-10 px-4 sm:px-6 pb-8 sm:pb-12" variants={containerVariants}>
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <motion.div className="max-w-md mx-auto text-center" variants={itemVariants}>
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Problems Available</h3>
              <p className="text-gray-400">Check back later for new coding challenges</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
