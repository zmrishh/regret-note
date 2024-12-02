import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBolt, 
  FaStopwatch, 
  FaTrash, 
  FaLock, 
  FaUnlock 
} from 'react-icons/fa';
import { useVentMode } from '../../contexts/VentModeContext';

export function VentModeButton() {
  const { 
    isVentModeActive, 
    timeRemaining, 
    startVentMode, 
    cancelVentMode 
  } = useVentMode();

  const [showOptions, setShowOptions] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10 * 60); // 10 minutes default

  const durationOptions = [
    { label: '5 mins', value: 5 * 60 },
    { label: '10 mins', value: 10 * 60 },
    { label: '15 mins', value: 15 * 60 }
  ];

  const anonymityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];

  const [selectedAnonymity, setSelectedAnonymity] = useState('high');

  const handleStartVentMode = () => {
    startVentMode({
      duration: selectedDuration,
      selfDestructTime: 24 * 60 * 60, // 24 hours
      anonymityLevel: selectedAnonymity
    });
    setShowOptions(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isVentModeActive ? (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-red-500/90 text-white rounded-full p-4 flex items-center space-x-3 shadow-2xl"
          >
            <FaStopwatch className="w-6 h-6" />
            <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
            <motion.button
              onClick={cancelVentMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/20 p-2 rounded-full"
            >
              <FaTrash className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div>
            <motion.button
              onClick={() => setShowOptions(!showOptions)}
              className="bg-accent-orange text-white rounded-full p-4 shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaBolt className="w-6 h-6" />
            </motion.button>

            {showOptions && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-full right-0 mb-4 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 w-64 space-y-4"
              >
                <div>
                  <label className="block text-sm text-white/70 mb-2">Duration</label>
                  <div className="flex space-x-2">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedDuration(option.value)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-colors
                          ${selectedDuration === option.value 
                            ? 'bg-accent-orange text-white' 
                            : 'bg-white/10 text-white/70 hover:bg-white/20'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Anonymity</label>
                  <div className="flex space-x-2">
                    {anonymityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedAnonymity(option.value)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-2
                          ${selectedAnonymity === option.value 
                            ? 'bg-accent-orange text-white' 
                            : 'bg-white/10 text-white/70 hover:bg-white/20'}
                        `}
                      >
                        {option.label === 'High' && <FaLock className="w-3 h-3" />}
                        {option.label === 'Medium' && <FaUnlock className="w-3 h-3" />}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleStartVentMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-accent-orange text-white py-2 rounded-lg hover:bg-accent-orange/80 transition-colors"
                >
                  Start Vent Mode
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
