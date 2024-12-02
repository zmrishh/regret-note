import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLock, 
  FaUnlock, 
  FaSkullCrossbones, 
  FaHeart, 
  FaRegSadTear, 
  FaFire 
} from 'react-icons/fa';
import { useVentMode } from '../../contexts/VentModeContext';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';
import { cn } from '@/lib/utils';
import { confessionService } from '../../services/api';

export function VentModeTextArea() {
  const { 
    isVentModeActive, 
    ventEntry, 
    timeRemaining, 
    updateVentEntry,
    cancelVentMode
  } = useVentMode();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  const placeholders = useMemo(() => [
    "Spill the tea, no filter ",
    "Main character energy incoming ",
    "Vibes are NOT immaculate rn ",
    "This is giving emotional damage ",
    "Lowkey struggling, highkey venting "
  ], []);

  const ventModeInsights = useMemo(() => [
    {
      icon: <FaRegSadTear className="text-brand-orange-300" />,
      text: "It's giving emotional support (no cap) "
    },
    {
      icon: <FaHeart className="text-brand-orange-400" />,
      text: "Your feelings are valid, bestie! We stan self-care "
    },
    {
      icon: <FaFire className="text-brand-orange-500" />,
      text: "Yeet those negative vibes into the void "
    }
  ], []);

  const handleSubmit = async (e) => {
    if (!inputValue || !inputValue.trim()) {
      setSubmitMessage('Bruh, write something first ');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await confessionService.create({
        content: inputValue,
        emotions: ['vent', 'gen-z-mood'],
        anonymityLevel: ventEntry.anonymityLevel || 'full',
        contentType: 'text',
        isPublic: ventEntry.anonymityLevel !== 'high'
      });

      setSubmitMessage('Slayed that vent, no cap! ');
      
      // Reset and close vent mode
      setTimeout(() => {
        cancelVentMode();
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Oof, something went wrong. Try again? ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnonymityIcon = () => {
    switch (ventEntry?.anonymityLevel) {
      case 'high':
        return <FaLock className="text-brand-orange-500 animate-pulse" />;
      case 'medium':
        return <FaUnlock className="text-brand-orange-300 animate-bounce" />;
      case 'low':
        return <FaUnlock className="text-brand-orange-200" />;
      default:
        return null;
    }
  };

  const vanishInputProps = useMemo(() => ({
    placeholders,
    onChange: (e) => setInputValue(e.target.value),
    onSubmit: handleSubmit,
    onVanish: () => {}
  }), [placeholders, handleSubmit]);

  const { render: vanishInput, triggerVanish } = PlaceholdersAndVanishInput(vanishInputProps);

  if (!isVentModeActive) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-40 bg-gradient-to-br from-brand-black to-brand-black/90 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-4xl bg-white/5 rounded-3xl border border-brand-orange-300/20 overflow-hidden shadow-gen-z">
          {/* Header */}
          <div className="bg-brand-black/50 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {getAnonymityIcon()}
              <span className="text-brand-white/70 text-lg font-bold">
                {ventEntry?.anonymityLevel.charAt(0).toUpperCase() + ventEntry?.anonymityLevel.slice(1)} Anonymity Vibes
              </span>
            </div>
            <div className="text-brand-white/70 text-lg font-bold flex items-center space-x-2">
              <FaSkullCrossbones className="animate-pulse text-brand-orange-400" />
              <span>
                Time Left: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
              </span>
            </div>
          </div>

          {/* Vanishing Input */}
          <div className="p-8">
            {vanishInput}
          </div>

          {/* Insights */}
          <div className="px-8 pb-8 grid grid-cols-3 gap-4">
            {ventModeInsights.map((insight, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 p-4 rounded-xl flex items-center space-x-4 hover:bg-brand-orange-300/10 transition-all"
              >
                <div className="text-2xl">{insight.icon}</div>
                <p className="text-brand-white/70 text-sm font-bold">{insight.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pb-8">
            <HoverBorderGradient
              onClick={() => {
                triggerVanish();
                handleSubmit();
              }}
              disabled={!inputValue || isSubmitting}
              containerClassName={cn(
                "group",
                inputValue 
                  ? "opacity-100 cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="group-hover:animate-pulse">
                {isSubmitting ? "Sending those vibes... " : "Yeet My Feelings "}
              </span>
            </HoverBorderGradient>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-xl text-center font-bold
                ${submitMessage.includes('Slayed') 
                  ? 'bg-brand-orange-500/20 text-brand-orange-300' 
                  : 'bg-red-500/20 text-red-300'
                }`}
            >
              {submitMessage}
            </motion.div>
          )}

          {/* Footer */}
          <div className="bg-brand-black/50 p-4 text-center">
            <p className="text-xs text-brand-white/50 font-bold">
              {ventEntry?.anonymityLevel === 'high' 
                ? "This tea is about to be DELETED " 
                : "Your vibe check is saved (but make it lowkey) "}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
