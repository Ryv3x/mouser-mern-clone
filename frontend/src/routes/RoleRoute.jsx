import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleRoute = ({ role, children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    // show an animated warning first
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <p className="text-lg font-semibold text-red-600 mb-4">Access Denied</p>
          <p className="text-gray-700 mb-6">Your role no longer permits viewing this page.</p>
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.replace('/')}
          >Go Home</motion.button>
        </motion.div>
      </div>
    );
  }
  return children;
};

export default RoleRoute;
