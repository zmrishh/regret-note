import React from 'react';
import { motion } from 'framer-motion';

const StickyNoteConfession = ({ content, rotation = 0 }) => {
  const randomColor = () => {
    const colors = [
      'bg-yellow-200',
      'bg-pink-200',
      'bg-blue-200',
      'bg-green-200',
      'bg-purple-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <motion.div
      className={`${randomColor()} w-64 h-64 p-4 shadow-lg`}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        rotate: rotation,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ scale: 1.05 }}
    >
      <p className="font-handwritten text-gray-800 text-lg overflow-hidden">
        {content}
      </p>
      <div className="mt-4 text-sm text-gray-600">
        {new Date().toLocaleDateString()}
      </div>
    </motion.div>
  );
};

const ConfessionWall = () => {
  return (
    <div className="min-h-screen bg-off-black p-8">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Anonymous Confessions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sample confessions */}
        <StickyNoteConfession 
          content="I regret not telling them how I really felt..." 
          rotation={-5}
        />
        <StickyNoteConfession 
          content="Why did I eat that entire pizza at 3 AM?" 
          rotation={3}
        />
        <StickyNoteConfession 
          content="I should have studied instead of binge-watching..." 
          rotation={-2}
        />
      </div>
    </div>
  );
};

export default ConfessionWall;
