import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaPencilAlt } from 'react-icons/fa';

const JournalEntryCard = ({ entry }) => {
  const { date, mode, type, content, intensity, emoji } = entry;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  // Determine color and styling based on mode
  const modeStyles = {
    'feeling-fine': {
      bgGradient: 'from-green-500/20 to-green-600/20',
      textColor: 'text-green-300'
    },
    'major-facepalm': {
      bgGradient: 'from-red-500/20 to-red-600/20',
      textColor: 'text-red-300'
    }
  };

  const { bgGradient, textColor } = modeStyles[mode] || modeStyles['feeling-fine'];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`
        relative 
        bg-gradient-to-br ${bgGradient}
        border border-white/20 
        rounded-xl 
        overflow-hidden 
        backdrop-blur-sm 
        shadow-lg
        p-4
        flex 
        flex-col 
        justify-between
        min-h-[200px]
      `}
    >
      {/* Entry Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{emoji}</span>
          <span className={`text-sm font-medium ${textColor}`}>{formattedDate}</span>
        </div>
        
        {/* Entry Type Icon */}
        <div className="text-white/70">
          {type === 'voice' ? <FaMicrophone /> : <FaPencilAlt />}
        </div>
      </div>

      {/* Entry Content */}
      <p className="text-white/80 text-sm flex-grow line-clamp-4">
        {content}
      </p>

      {/* Intensity Indicator */}
      <div className="flex space-x-1 mt-4">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className={`
              h-2 w-full rounded-full 
              ${index < intensity 
                ? (mode === 'feeling-fine' ? 'bg-green-500' : 'bg-red-500')
                : 'bg-white/20'
              }
            `}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default JournalEntryCard;
