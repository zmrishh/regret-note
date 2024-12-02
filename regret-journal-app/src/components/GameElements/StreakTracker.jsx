import React from 'react';
import { motion } from 'framer-motion';

const StreakTracker = ({ streakCount, type }) => {
  const getEmoji = () => {
    if (type === 'facepalm') return '🤦';
    return '😌';
  };

  return (
    <motion.div 
      className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="text-3xl">{getEmoji()}</span>
      <div>
        <h3 className="text-lg font-semibold text-white">
          {type === 'facepalm' ? 'Facepalm' : 'Feeling Fine'} Streak
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-accent-orange">{streakCount}</span>
          <span className="text-white/70">days</span>
        </div>
      </div>

      {/* Streak Fire Animation */}
      {streakCount > 2 && (
        <motion.span
          className="text-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🔥
        </motion.span>
      )}
    </motion.div>
  );
};

export default StreakTracker;
