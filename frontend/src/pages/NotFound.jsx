import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Text with Animation */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8"
        >
          <motion.h1
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Oops!
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-8"
        >
          Page Not Found
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-gray-500 mb-8"
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-4 justify-center"
        >
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/')}
            className="bg-primary text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home <ArrowRight size={20} />
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="mt-12 relative h-24"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full blur-xl"></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
