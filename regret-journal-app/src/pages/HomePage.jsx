import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaMagic, 
  FaHeartBroken, 
  FaBrain, 
  FaMicrophone 
} from 'react-icons/fa';
import { 
  MdEmojiEmotions, 
  MdSentimentVerySatisfied, 
  MdSentimentDissatisfied 
} from 'react-icons/md';

// Gen Z Slang Generator
const SLANG_GENERATOR = [
  "no cap, we're healing today 💯",
  "main character energy activated 🌟",
  "vibes are immaculate rn 🔥",
  "living my best emotional journey 💖",
  "we're not okay, and that's valid 🤷‍♀️"
];

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  // Slang Generator
  const getRandomSlang = () => {
    return SLANG_GENERATOR[Math.floor(Math.random() * SLANG_GENERATOR.length)];
  };

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
                how are we feeling today? 🤔
              </h1>
              
              <div className="flex justify-center space-x-8">
                <motion.button
                  onClick={() => handleMoodSelect('regret')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block group-hover:animate-bounce">😫</span>
                  <span className="text-xl font-bold text-white">major facepalm</span>
                  <p className="text-sm text-white/70 mt-2">i have some tea to spill 🫖</p>
                </motion.button>
                
                <motion.button
                  onClick={() => handleMoodSelect('fine')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block group-hover:animate-pulse">😎</span>
                  <span className="text-xl font-bold text-white">vibing rn</span>
                  <p className="text-sm text-white/70 mt-2">just want to reflect 💭</p>
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
                choose your chaos mode 🌪️
              </h1>
              
              <div className="flex justify-center space-x-8">
                <motion.button
                  onClick={() => handleJournalMode('text')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block group-hover:rotate-12">✍️</span>
                  <span className="text-xl font-bold text-white">text dump</span>
                  <p className="text-sm text-white/70 mt-2">unhinged thoughts incoming 🌪️</p>
                </motion.button>
                
                <motion.button
                  onClick={() => handleJournalMode('voice')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 w-64 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-6xl mb-4 block group-hover:animate-spin">🎙️</span>
                  <span className="text-xl font-bold text-white">audio chaos</span>
                  <p className="text-sm text-white/70 mt-2">scream into the void 😱</p>
                </motion.button>
              </div>

              <motion.button
                onClick={() => setSelectedMood(null)}
                className="mt-8 text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeartBroken /> go back and choose another vibe
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HomePage;
