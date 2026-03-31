import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMap, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors">

      {/* Subtle background gradient elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/5 dark:bg-indigo-600/5 rounded-full blur-[100px]"></div>

      <motion.div
        className="relative z-10 text-center max-w-2xl px-6 py-16 md:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Icon */}
        <motion.div
          className="inline-block p-4 bg-blue-100 dark:bg-blue-950/40 rounded-2xl mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FiMap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          DIPLOT TRAVEL
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed font-light"
          variants={itemVariants}
        >
          Преписва вашата история. Къде далеч?
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link to="/login">
            <motion.button
              className="group relative px-10 py-3 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center gap-3 whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Вход
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <Link to="/register">
            <motion.button
              className="px-10 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold text-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Регистрирай
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3"
          variants={itemVariants}
        >
          <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-semibold tracking-widest">
            Powered by AI &amp; Modern Technology
          </p>
          <div className="flex gap-2 text-xs text-slate-400 dark:text-slate-600">
            <span>React</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>MongoDB</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;