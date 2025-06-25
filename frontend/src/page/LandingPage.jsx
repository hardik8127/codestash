import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { Code, Terminal, Users, BookOpen, ChevronRight, Zap, Award } from 'lucide-react'
import './LandingPage.css'

// Animated Background Component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const particlesArray = [];
      const particleCount = 25; // Increased number of particles
      
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push({
          id: i,
          size: Math.random() * 80 + 20, // Size between 20-100px
          left: Math.random() * 100, // Position from left (0-100%)
          duration: Math.random() * 20 + 10, // Animation duration (10-30s)
          delay: Math.random() * 10, // Delay before animation starts (increased for more variety)
          opacity: 0.1 + Math.random() * 0.4, // Random opacity
          color: Math.random() > 0.5 ? 'purple' : 'blue', // Random color
        });
      }
      
      setParticles(particlesArray);
    };
    
    generateParticles();
    
    // Regenerate particles periodically for continuous effect
    const interval = setInterval(() => {
      generateParticles();
    }, 20000); // Every 20 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="animated-bg">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, particle.opacity, particle.opacity, 0],
            y: [0, -window.innerHeight * 0.7, -window.innerHeight],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            bottom: '-5%',
            background: particle.color === 'purple' 
              ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.1))' 
              : 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0.1))',
            boxShadow: `0 0 20px 2px rgba(${particle.color === 'purple' ? '124, 58, 237' : '59, 130, 246'}, 0.1)`
          }}
        />
      ))}
      <div className="hero-overlay"></div>
    </div>
  );
};

const LandingPage = () => {
  const { authUser } = useAuthStore()
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
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }
  
  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }
  
  const heroItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring",        stiffness: 100,
        duration: 0.8 
      } 
    }
  };
  
  return (
    <div className="w-full text-white">
      <div className="container-fluid px-0 mx-auto w-full">      {/* Hero Section */}      <motion.section 
        className="px-4 md:px-8 pt-8 pb-16 md:py-24 w-full max-w-full mx-auto relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatedBackground />
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => {
            document.querySelector('#features-section').scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          <div className="scroll-indicator-text">Scroll Down</div>
          <div className="scroll-arrow"></div>
        </motion.div>        <motion.div className="flex flex-col items-center text-center gap-6 relative z-10" variants={containerVariants}><motion.h1 
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center gap-4"
            variants={heroItemVariants}
          >
            <img src="/codestash-logo.svg" alt="CodeStash Logo" className="w-16 h-16" />
            CodeStash
          </motion.h1>          <motion.p 
            className="text-xl md:text-2xl text-gray-300 w-full md:w-4/5 lg:w-3/4"
            variants={heroItemVariants}
          >
            Level up your coding skills with interactive challenges, real-time feedback, and a supportive community
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-6"
            variants={heroItemVariants}
          >
            <Link to={authUser ? "/home" : "/login"}>
              <motion.button 
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md font-medium text-white flex items-center gap-2 hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link to="/home">
              <motion.button 
                className="px-8 py-3 bg-transparent border border-gray-600 rounded-md font-medium text-white flex items-center gap-2 hover:border-gray-400 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Challenges
              </motion.button>            </Link>          </motion.div>            <motion.div className="flex justify-center w-full mt-12 mb-16 px-4"            variants={heroItemVariants}>            <motion.div className="w-full max-w-3xl relative hero-code-block shadow-lg backdrop-blur-sm"              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}            >              <motion.div 
                className="relative bg-gray-900/40 border-0 rounded-xl shadow-md flex flex-col backdrop-blur-sm"
              ><div className="px-4 py-3 border-b border-gray-700/30 flex items-center bg-transparent">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/90"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/90"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/90"></div>
                  </div>
                  <div className="mx-auto text-gray-300 text-xs font-mono flex items-center">
                    <span className="bg-purple-500/20 px-2 py-1 rounded mr-2">JS</span>
                    solveProblem.js
                  </div>                </div>                <div className="p-6 flex-grow flex items-center overflow-hidden bg-transparent rounded-b-xl">
                  <pre className="text-left text-sm md:text-base w-full flex">
                    <div className="line-numbers text-gray-500 mr-4 select-none text-right">
                      <div>1</div>
                      <div>2</div>
                      <div>3</div>
                      <div>4</div>
                      <div>5</div>
                    </div>                    <code className="text-gray-300 flex-1">
                      <span className="text-indigo-400">function</span> <span className="text-emerald-400">solveProblem</span>(<span className="text-amber-300">input</span>) {'{'
                      }
                      <br />  <span className="text-gray-500">// Your solution goes here</span>
                      <br />  <span className="text-indigo-400">const</span> solution = input.<span className="text-emerald-400">map</span>(<span className="text-amber-300">item</span> {'=>'} item * 2);
                      <br />  <span className="text-indigo-400">return</span> solution;
                      <br />{'}'}<span className="typing-cursor"></span>
                    </code>
                  </pre>                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}      <motion.section 
        className="py-20 px-4 md:px-8 w-full bg-transparent"
        id="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="w-full mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            Why choose <span className="text-purple-400">CodeStash</span>?
          </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all feature-card"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-purple-500/20 p-3 rounded-full w-fit mb-5">
                <Code size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Coding</h3>
              <p className="text-gray-400">Write, test, and run code directly in your browser with our powerful code editor.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all feature-card"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-blue-500/20 p-3 rounded-full w-fit mb-5">
                <Terminal size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Feedback</h3>
              <p className="text-gray-400">Get instant feedback on your code with our intelligent testing system.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all feature-card"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-green-500/20 p-3 rounded-full w-fit mb-5">
                <Users size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Learning</h3>
              <p className="text-gray-400">Join a community of developers to share solutions and learn together.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>      {/* How It Works Section */}
      <motion.section        className="py-20 px-8"
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="w-full mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            How <span className="text-blue-400">CodeStash</span> Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="bg-purple-500/20 p-4 rounded-full w-fit mb-5 relative">
                <BookOpen size={32} className="text-purple-400" />
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Choose a Challenge</h3>
              <p className="text-gray-400">Browse our library of coding challenges, from beginner to advanced levels.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="bg-blue-500/20 p-4 rounded-full w-fit mb-5 relative">
                <Terminal size={32} className="text-blue-400" />
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Write Your Solution</h3>
              <p className="text-gray-400">Use our integrated code editor to solve the problem in your preferred language.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="bg-green-500/20 p-4 rounded-full w-fit mb-5 relative">
                <Award size={32} className="text-green-400" />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Track Your Progress</h3>
              <p className="text-gray-400">Submit your solution, get instant feedback, and track your progress over time.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}      <motion.section        className="py-20 px-4 md:px-8 w-full bg-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}      ><motion.div 
          className="w-full md:w-4/5 lg:w-3/4 mx-auto bg-gray-800/80 rounded-2xl p-12 border border-gray-700/50 text-center"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Ready to level up your coding skills?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            Join thousands of developers who are improving their skills with CodeStash
          </motion.p>
          <motion.div
            variants={itemVariants}
          >
            <Link to={authUser ? "/home" : "/signup"}>
              <motion.button 
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md font-medium text-white flex items-center gap-2 mx-auto hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {authUser ? "Explore Problems" : "Create Account"} <ChevronRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>      </motion.section>
      </div>
    </div>
  )
}

export default LandingPage