import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { World } from '@/components/ui/globe';
import { useGlobalConfessions } from '../contexts/GlobalConfessionContext';
import { FaShareAlt, FaFilter } from 'react-icons/fa';
import { MdEmojiEmotions, MdPrivacyTip } from 'react-icons/md';
import { StarsBackground } from '../components/ui/stars-background';
import { ShootingStars } from '../components/ui/shooting-stars';

const ConfessionsPage = () => {
  const [newConfession, setNewConfession] = useState('');
  const { addGlobalConfession, globalConfessions } = useGlobalConfessions();
  const [confessionMode, setConfessionMode] = useState('global');
  const worldRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newConfession.trim()) {
      // Add confession through global context
      await addGlobalConfession(newConfession);
      
      // Trigger beam animation on the globe
      if (worldRef.current && worldRef.current.addConfession) {
        await worldRef.current.addConfession(newConfession);
      }
      
      setNewConfession('');
    }
  };

  const getRandomSlang = () => {
    const slangs = [
      "spill the tea, no cap 🫖",
      "confessions go brr 🚀",
      "vibes are immaculate rn 💅",
      "we're all just living our best chaotic life 🌪️",
      "anonymous storytelling hits different 🤫"
    ];
    return slangs[Math.floor(Math.random() * slangs.length)];
  };

  const globeConfig = {
    pointLight: "#ffffff",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff"
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      <StarsBackground />
      <ShootingStars />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Slang */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center pt-8 pb-4 relative z-20"
        >
          <h1 className="text-6xl font-bold text-white mb-12">
            Confession Chronicles 🤫
          </h1>
          <p className="text-xl text-white/80 italic">
            {getRandomSlang()}
          </p>
        </motion.header>

        {/* Globe Visualization */}
        <div className="relative h-[70vh] w-full">
          <World 
            ref={worldRef}
            globeConfig={globeConfig} 
          />
        </div>

        {/* Confession Input */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50">
          <form 
            onSubmit={handleSubmit}
            className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-2xl p-4"
          >
            <textarea
              value={newConfession}
              onChange={(e) => setNewConfession(e.target.value)}
              placeholder="share your confession with the world..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 resize-none h-24"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <p className="text-white/60 text-sm">
                  {globalConfessions.length} global confessions
                </p>
                <div className="flex items-center space-x-2 text-white/40">
                  <MdPrivacyTip className="text-lg" />
                  <span className="text-xs">always anonymous</span>
                </div>
              </div>
              <motion.button
                type="submit"
                className="bg-accent-orange text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdEmojiEmotions className="text-xl" />
                <span>Confess</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfessionsPage;
