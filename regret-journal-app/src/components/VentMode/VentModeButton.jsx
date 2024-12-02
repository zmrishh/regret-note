import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSkullCrossbones, 
  FaBrain, 
  FaRegSadTear, 
  FaFire 
} from 'react-icons/fa';
import { useVentMode } from '../../contexts/VentModeContext';
import { cn } from '@/lib/utils';

export function VentModeButton() {
  const { 
    isVentModeActive, 
    startVentMode, 
    cancelVentMode 
  } = useVentMode();

  const buttonVariants = {
    initial: { 
      scale: 1, 
      rotate: 0,
      boxShadow: '0 4px 6px rgba(255,87,34,0.1)'
    },
    hover: { 
      scale: 1.1, 
      rotate: [0, -5, 5, 0],
      boxShadow: '0 10px 15px rgba(255,87,34,0.2)'
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getRandomSlangPhrase = () => {
    const phrases = [
      "no cap",
      "spill the tea",
      "main character energy",
      "vibes only",
      "yeet my feelings",
      "lowkey struggling",
      "big mood"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      animate="pulse"
      variants={buttonVariants}
      onClick={isVentModeActive ? cancelVentMode : startVentMode}
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full p-5 shadow-gen-z transition-all duration-300 ease-in-out group",
        isVentModeActive 
          ? "bg-brand-orange-500 text-brand-white hover:bg-brand-orange-600" 
          : "bg-gradient-to-br from-brand-orange-400 to-brand-orange-500 text-brand-white hover:from-brand-orange-500 hover:to-brand-orange-600"
      )}
      style={{
        width: '100px',
        height: '100px',
        boxShadow: '0 10px 25px rgba(255,87,34,0.2)'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isVentModeActive ? (
            <motion.div
              key="cancel"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              className="flex flex-col items-center"
            >
              <FaSkullCrossbones className="text-4xl mb-1 group-hover:animate-spin" />
              <span className="text-xs font-bold lowercase">abort mission</span>
            </motion.div>
          ) : (
            <motion.div
              key="start"
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
              className="flex flex-col items-center"
            >
              <FaBrain className="text-4xl mb-1 group-hover:animate-pulse" />
              <span className="text-xs font-bold lowercase">{getRandomSlangPhrase()}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
