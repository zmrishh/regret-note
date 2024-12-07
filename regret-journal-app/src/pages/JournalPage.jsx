import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarsBackground } from '../components/ui/stars-background';
import { ShootingStars } from '../components/ui/shooting-stars';
import { RainbowButton } from '../components/ui/RainbowButton';
import TextJournalMode from '../components/JournalingUI/TextJournalMode';
import VoiceJournalMode from '../components/JournalingUI/VoiceJournalMode';
import { useToast } from '../contexts/ToastContext';
import { useJournalingMode } from '../contexts/JournalingModeContext';
import { useNavigate } from 'react-router-dom';

const JournalPage = () => {
  const [journalContent, setJournalContent] = useState('');
  const [mode, setMode] = useState('text');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();
  const { journalingMode, resetJournalingMode } = useJournalingMode();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!journalContent.trim()) {
      showToast('Please write something before submitting', 'error', 'bottom-right');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: journalContent,
          mood: journalingMode,
          entry_type: mode,
          intensity: 5, // Default intensity
          is_anonymous: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }

      setIsSubmitted(true);
      showToast('Journal entry saved successfully! ✨', 'success', 'top');
    } catch (error) {
      console.error('Error submitting entry:', error);
      showToast('Failed to submit. Please try again.', 'error', 'bottom-right');
    }
  };

  const handleReset = () => {
    setJournalContent('');
    setIsSubmitted(false);
    showToast('Journal entry cleared', 'success', 'bottom-right');
  };

  const handleBack = () => {
    resetJournalingMode();
    navigate('/', { state: { refresh: true } });
  };

  // Determine prompts based on journaling mode
  const modeConfig = {
    'feeling-fine': {
      title: 'Feeling Fine 🌞',
      prompts: [
        "What made you smile today?",
        "Write something that lifted your mood.",
        "Describe a moment of joy or peace.",
        "Reflect on a small win or achievement."
      ]
    },
    'major-facepalm': {
      title: 'Major Facepalm 😖',
      prompts: [
        "What went wrong today?",
        "What's been on your mind?",
        "Describe a challenging moment.",
        "How are you processing your emotions?"
      ]
    }
  };

  const currentConfig = modeConfig[journalingMode] || modeConfig['feeling-fine'];

  const modes = [
    { 
      id: 'text', 
      icon: '✍️', 
      label: 'Text', 
      description: 'Write it down' 
    },
    { 
      id: 'voice', 
      icon: '🎙️', 
      label: 'Voice', 
      description: 'Speak your mind' 
    }
  ];

  // Get current date
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', { weekday: 'long' });

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
        <StarsBackground />
        <ShootingStars />
      </div>

      {/* Date Display - Fixed Position */}
      <div className="fixed z-20" style={{ left: '138px', top: '128px' }}>
        <div className="text-8xl font-bold text-white">{day}</div>
        <div className="text-3xl font-bold text-white/80">{month}' {date.getFullYear().toString().slice(2)}</div>
        <div className="text-xl text-white/60">{weekday}</div>
      </div>

      {/* Title and Mode Selection - Fixed Position */}
      <div className="fixed z-20" style={{ left: '300px', top: '399px' }}>
        <h1 className="text-5xl font-bold text-white leading-tight">
          {currentConfig.title}
        </h1>
        
        <div className="flex space-x-4 mt-6">
          {modes.map(({ id, icon, label }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(id)}
              className={`
                px-6 py-4 rounded-xl backdrop-blur-sm transition-all flex items-center
                ${mode === id 
                  ? 'bg-orange-500 text-white ring-2 ring-pink-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70'}
              `}
            >
              <span className="text-2xl mr-3">{icon}</span>
              <span className="font-bold">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Journal Content - Fixed Position */}
      <div className="fixed z-20" style={{ left: '926px', top: '150px' }}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="journal-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-[600px]"
            >
              {/* Journal Input */}
              <div className="w-full mb-8">
                {mode === 'text' ? (
                  <TextJournalMode 
                    onTextChange={setJournalContent}
                    mood={null}
                    placeholders={currentConfig.prompts}
                  />
                ) : (
                  <VoiceJournalMode 
                    onTranscriptChange={setJournalContent}
                    mood={null}
                    placeholders={currentConfig.prompts}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-6 justify-center">
                <RainbowButton
                  onClick={handleSubmit}
                  className="flex-1 text-lg"
                  disabled={journalContent.trim() === ''}
                >
                  📝 Submit Entry
                </RainbowButton>

                <RainbowButton
                  onClick={handleReset}
                  className="flex-1 text-lg"
                >
                  🗑️ Clear All
                </RainbowButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="journal-submitted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-[600px] flex flex-col items-center space-y-8"
            >
              <h1 className="text-5xl font-bold text-white">
                Entry Saved! 🎉
              </h1>

              <div className="flex space-x-6 w-full">
                <RainbowButton
                  onClick={handleReset}
                  className="flex-1 text-lg"
                >
                  ✍️ Write Another
                </RainbowButton>

                <RainbowButton
                  onClick={() => {/* TODO: Navigate to journal list or home */}}
                  className="flex-1 text-lg"
                >
                  📋 View Entries
                </RainbowButton>
              </div>

              <RainbowButton
                onClick={handleBack}
                className="text-white/50 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Home
              </RainbowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Container - Just for Background */}
      <div className="relative z-10 w-full h-full">
        <div className="w-full h-full" />
      </div>
    </div>
  );
};

export default JournalPage;
