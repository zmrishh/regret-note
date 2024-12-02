import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EmojiSentimentTracker = ({ text }) => {
  const [currentEmoji, setCurrentEmoji] = useState('😐');

  // Simple sentiment analysis based on keywords
  useEffect(() => {
    const positiveWords = ['happy', 'good', 'great', 'awesome', 'love', 'excited'];
    const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'angry', 'regret'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount) setCurrentEmoji('😊');
    else if (negativeCount > positiveCount) setCurrentEmoji('😔');
    else setCurrentEmoji('😐');
  }, [text]);

  return (
    <motion.div 
      className="text-6xl"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {currentEmoji}
    </motion.div>
  );
};

export default EmojiSentimentTracker;
