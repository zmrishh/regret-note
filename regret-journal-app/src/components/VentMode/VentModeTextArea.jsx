import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useVentMode } from '../../contexts/VentModeContext';

export function VentModeTextArea() {
  const { 
    isVentModeActive, 
    ventEntry, 
    timeRemaining, 
    updateVentEntry 
  } = useVentMode();

  const textareaRef = useRef(null);

  // Auto-focus textarea when vent mode is active
  useEffect(() => {
    if (isVentModeActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isVentModeActive]);

  // Prevent default paste and copy behaviors for high anonymity
  useEffect(() => {
    const handleCopyPaste = (e) => {
      if (ventEntry?.anonymityLevel === 'high') {
        e.preventDefault();
      }
    };

    if (isVentModeActive) {
      document.addEventListener('copy', handleCopyPaste);
      document.addEventListener('paste', handleCopyPaste);
    }

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [isVentModeActive, ventEntry]);

  if (!isVentModeActive) return null;

  const handleTextChange = (e) => {
    updateVentEntry(e.target.value);
  };

  const getAnonymityIcon = () => {
    switch (ventEntry?.anonymityLevel) {
      case 'high':
        return <FaLock className="text-red-500" />;
      case 'medium':
        return <FaUnlock className="text-yellow-500" />;
      case 'low':
        return <FaUnlock className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-40 bg-off-black/90 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-2xl bg-white/10 rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {getAnonymityIcon()}
              <span className="text-white/70 text-sm">
                {ventEntry?.anonymityLevel.charAt(0).toUpperCase() + ventEntry?.anonymityLevel.slice(1)} Anonymity
              </span>
            </div>
            <div className="text-white/70 text-sm">
              Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={ventEntry?.content || ''}
            onChange={handleTextChange}
            placeholder="Start venting... Your thoughts are safe here."
            className="
              w-full h-[50vh] bg-transparent text-white/80 p-6 
              focus:outline-none resize-none 
              placeholder-white/50 
              text-lg tracking-wide leading-relaxed
            "
            maxLength={2000}  // Limit to prevent extremely long entries
            spellCheck="false"
          />

          {/* Footer */}
          <div className="bg-white/5 p-4 text-center">
            <p className="text-xs text-white/50">
              {ventEntry?.anonymityLevel === 'high' 
                ? "This entry will self-destruct and cannot be recovered." 
                : "This entry will be saved with limited visibility."}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
