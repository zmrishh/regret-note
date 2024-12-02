import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TextJournalMode from '../components/JournalingUI/TextJournalMode';
import VoiceJournalMode from '../components/JournalingUI/VoiceJournalMode';

const JournalPage = () => {
  const location = useLocation();
  const [mood, setMood] = useState(null);
  const [mode, setMode] = useState(null);
  const [journalContent, setJournalContent] = useState('');

  useEffect(() => {
    // Check if state was passed from HomePage
    const state = location.state || {};
    setMood(state.mood || null);
    setMode(state.mode || 'text');
  }, [location]);

  const modes = [
    { id: 'text', icon: '✍️', label: 'Type It Out' },
    { id: 'voice', icon: '🎙️', label: 'Voice It Out' }
  ];

  const handleContentChange = (content) => {
    setJournalContent(content);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-theme(spacing.20))] relative w-full p-4"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4">
        {/* Header */}
        <motion.div
          className="mb-8 text-center w-full"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white via-white to-accent-orange bg-clip-text text-transparent">
            {mood === 'regret' ? 'Process Your Facepalm Moment' : 'Your Reflection Space'}
          </h1>
          <p className="text-lg font-body text-white/70">
            {mood === 'regret' 
              ? 'Transforming challenges into personal growth' 
              : 'Take a moment to reflect and appreciate'}
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="mb-8 w-full">
          <div className="flex justify-center space-x-4">
            {modes.map(({ id, icon, label }) => (
              <motion.button
                key={id}
                className={`relative px-6 py-3 rounded-xl backdrop-blur-sm
                          ${mode === id 
                            ? 'bg-accent-orange text-white' 
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                          } transition-colors`}
                onClick={() => handleModeChange(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-subheading font-bold">{label}</span>
                </div>
                {mode === id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-white/20"
                    layoutId="mode-indicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Journal Mode Container */}
        <motion.div
          className="relative w-full"
          layout
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {mode === 'text' ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TextJournalMode 
                  onTextChange={handleContentChange} 
                  mood={mood} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <VoiceJournalMode 
                  onTranscriptChange={handleContentChange} 
                  mood={mood} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JournalPage;
