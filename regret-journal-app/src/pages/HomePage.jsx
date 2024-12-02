import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleJournalMode = (mode) => {
    navigate('/journal', { 
      state: { 
        mood: selectedMood, 
        mode: mode 
      } 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-theme(spacing.20))] w-full p-4 flex items-center justify-center"
    >
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            <motion.div
              key="mood-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 bg-gradient-to-r from-white via-white to-accent-orange bg-clip-text text-transparent">
                How are you feeling today?
              </h1>
              
              <div className="flex justify-center space-x-8">
                <motion.button
                  onClick={() => handleMoodSelect('regret')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block">😫</span>
                  <span className="text-xl font-subheading font-bold text-white">Major Facepalm</span>
                  <p className="text-sm font-body text-white/70 mt-2">I have some regrets to process</p>
                </motion.button>
                
                <motion.button
                  onClick={() => handleMoodSelect('fine')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block">😎</span>
                  <span className="text-xl font-subheading font-bold text-white">Feeling Fine</span>
                  <p className="text-sm font-body text-white/70 mt-2">Just want to reflect</p>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mode-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 bg-gradient-to-r from-white via-white to-accent-orange bg-clip-text text-transparent">
                How would you like to journal?
              </h1>
              
              <div className="flex justify-center space-x-8">
                <motion.button
                  onClick={() => handleJournalMode('text')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block">✍️</span>
                  <span className="text-xl font-subheading font-bold text-white">Type It Out</span>
                  <p className="text-sm font-body text-white/70 mt-2">Write your thoughts</p>
                </motion.button>
                
                <motion.button
                  onClick={() => handleJournalMode('voice')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block">🎙️</span>
                  <span className="text-xl font-subheading font-bold text-white">Voice It Out</span>
                  <p className="text-sm font-body text-white/70 mt-2">Speak your mind</p>
                </motion.button>
              </div>

              <motion.button
                onClick={() => setSelectedMood(null)}
                className="mt-8 text-white/50 hover:text-white transition-colors font-body"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Go Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HomePage;
