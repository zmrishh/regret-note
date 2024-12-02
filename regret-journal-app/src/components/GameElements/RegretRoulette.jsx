import React, { useState } from 'react';
import { motion } from 'framer-motion';

const prompts = [
  "What's the smallest thing you regret today?",
  "If you could redo one moment this week, what would it be?",
  "What's a regret that makes you laugh now?",
  "What's something you wish you'd said?",
  "What's a food choice you regret?",
  "What's a purchase you wish you hadn't made?",
  "What's a Netflix show you regret starting?",
  "What's a text you wish you hadn't sent?"
];

const RegretRoulette = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const spinRoulette = () => {
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setTimeout(() => {
      setCurrentPrompt(prompts[randomIndex]);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <motion.button
        className="bg-accent-orange text-white px-8 py-4 rounded-full text-xl font-bold mb-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spinRoulette}
        disabled={isSpinning}
      >
        Spin the Regret Roulette
      </motion.button>

      <motion.div
        className="bg-white/10 p-6 rounded-lg max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: currentPrompt ? 1 : 0,
          rotate: isSpinning ? 360 : 0
        }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xl text-white">{currentPrompt || "Spin to get a prompt!"}</p>
      </motion.div>
    </div>
  );
};

export default RegretRoulette;
