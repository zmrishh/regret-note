import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { confessionService } from '../../services/api';
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { cn } from '@/lib/utils';

const TextJournalMode = ({ onTextChange, mood }) => {
  const [journalText, setJournalText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [spiciness, setSpiciness] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const maxChars = 1000;

  useEffect(() => {
    // Set dynamic placeholder based on mood
    if (mood === 'regret') {
      const regretPrompts = [
        'What moment are you regretting?',
        'Describe the situation that\'s weighing on you...',
        'What lesson can you learn from this experience?',
        'How did this moment make you feel?'
      ];
      setPlaceholder(regretPrompts[Math.floor(Math.random() * regretPrompts.length)]);
    } else {
      const reflectionPrompts = [
        'What are you grateful for today?',
        'Describe a moment that brought you joy...',
        'What personal growth have you noticed recently?',
        'How are you feeling in this moment?'
      ];
      setPlaceholder(reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]);
    }
  }, [mood]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setJournalText(text);
      onTextChange(text);
    }
  };

  const handleSubmit = async () => {
    if (!journalText.trim()) {
      setSubmitMessage('Please enter your thoughts before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await confessionService.create({
        content: journalText,
        emotions: [mood || 'neutral'],
        anonymityLevel: 'full',
        contentType: 'text',
        isPublic: true
      });

      setSubmitMessage('Confession submitted successfully! 🌈');
      setJournalText('');
      onTextChange('');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const spicinessLevels = [
    { level: 1, emoji: '😌', label: 'Mild' },
    { level: 2, emoji: '😅', label: 'Medium' },
    { level: 3, emoji: '😰', label: 'Spicy' },
    { level: 4, emoji: '🤦', label: 'Major Facepalm' },
  ];

  const getGradientBySpiciness = (level) => {
    switch(level) {
      case 1: return 'from-green-500/20 to-green-600/20';
      case 2: return 'from-yellow-500/20 to-yellow-600/20';
      case 3: return 'from-orange-500/20 to-orange-600/20';
      case 4: return 'from-red-500/20 to-red-600/20';
      default: return 'from-white/10 to-white/5';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Spiciness Selector */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl" />
        <motion.div 
          className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-medium mb-4 text-white/80">Regret Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spicinessLevels.map(({ level, emoji, label }) => (
              <motion.button
                key={level}
                className={`relative group ${
                  spiciness === level 
                    ? 'bg-gradient-to-br ' + getGradientBySpiciness(level)
                    : 'bg-white/5 hover:bg-white/10'
                } backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-colors`}
                onClick={() => setSpiciness(level)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl transform group-hover:scale-110 transition-transform">
                    {emoji}
                  </span>
                  <span className="text-sm font-medium text-white/70">
                    {label}
                  </span>
                </div>
                {spiciness === level && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-white/20"
                    layoutId="spiciness-indicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Text Input Area */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientBySpiciness(spiciness)} rounded-2xl blur-xl opacity-50`} />
        <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white/80">Your Thoughts</h3>
            <span className="text-sm text-white/50">
              {journalText.length}/{maxChars}
            </span>
          </div>
          
          <div className="relative">
            <textarea
              value={journalText}
              onChange={handleTextChange}
              placeholder={placeholder}
              className="w-full h-64 bg-black/20 rounded-xl border border-white/10 p-4
                       text-white placeholder-white/30 focus:outline-none focus:ring-2
                       focus:ring-accent-orange/50 resize-none"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem'
              }}
            />
            
            {/* Glowing Cursor Line */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-orange/50 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleX: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Character Count Warning */}
          <AnimatePresence>
            {journalText.length > maxChars * 0.9 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-2 text-sm text-accent-orange"
              >
                Approaching character limit
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div 
            className="mt-4 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HoverBorderGradient
              onClick={handleSubmit}
              disabled={isSubmitting || !journalText.trim()}
              containerClassName={cn(
                journalText.trim() 
                  ? "opacity-100 cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Sharing your thoughts..." : "Share Anonymously"}
            </HoverBorderGradient>
          </motion.div>

          {/* Submit Message */}
          <AnimatePresence>
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`mt-4 p-4 rounded-xl text-center
                  ${submitMessage.includes('successfully') 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                  }`}
              >
                {submitMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TextJournalMode;
