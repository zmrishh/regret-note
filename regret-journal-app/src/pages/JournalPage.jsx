import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TextJournalMode from '../components/JournalingUI/TextJournalMode';
import VoiceJournalMode from '../components/JournalingUI/VoiceJournalMode';

// Gen Z Mood Emojis with Slang
const MOOD_VIBES = {
  'fire': { emoji: '🔥', label: 'main character energy', intensity: 'high' },
  'sad': { emoji: '😭', label: 'lowkey devastated', intensity: 'deep' },
  'neutral': { emoji: '😐', label: 'just existing', intensity: 'meh' },
  'chaotic': { emoji: '🤪', label: 'unhinged vibes', intensity: 'wild' },
  'numb': { emoji: '💀', label: 'no thoughts', intensity: 'zero' }
};

const JournalPage = () => {
  const location = useLocation();
  const [mood, setMood] = useState(null);
  const [mode, setMode] = useState('text');
  const [journalContent, setJournalContent] = useState('');
  const [selectedMoodVibe, setSelectedMoodVibe] = useState(null);

  useEffect(() => {
    const state = location.state || {};
    setMood(state.mood || null);
    setMode(state.mode || 'text');
  }, [location]);

  const modes = [
    { 
      id: 'text', 
      icon: '✍️', 
      label: 'Type It Out 🧠', 
      description: 'dump ur brain juice rn 💦' 
    },
    { 
      id: 'voice', 
      icon: '🎙️', 
      label: 'Voice It Out 🗣️', 
      description: 'scream into the void 😱' 
    }
  ];

  const getRandomSlangEncouragement = useMemo(() => {
    const slangs = [
      "you're literally serving rn 💅",
      "healing is a whole mood 🌈",
      "main character energy activated ✨",
      "no cap, we're growing today 💯",
      "ur feelings? valid. period. 🤘",
      "living ur best emotional journey 💖",
      "we're not okay, and that's aesthetic 🖤"
    ];
    return slangs[Math.floor(Math.random() * slangs.length)];
  }, []);

  const handleMoodSelect = (moodKey) => {
    setSelectedMoodVibe(moodKey);
    // Maybe trigger some fun animation or sound?
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white relative overflow-hidden p-4"
    >
      {/* Chaotic Background Vibes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Viby Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {mood === 'regret' ? 'Facepalm Moment 🤦‍♀️' : 'Emotional Dump Zone 🗑️'}
          </h1>
          <p className="text-xl text-white/80 italic">
            {getRandomSlangEncouragement}
          </p>
        </motion.header>

        {/* Mode Selector with Gen Z Flair */}
        <div className="flex justify-center space-x-4 mb-10">
          {modes.map(({ id, icon, label, description }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(id)}
              className={`
                px-6 py-3 rounded-xl backdrop-blur-sm transition-all
                ${mode === id 
                  ? 'bg-orange-500 text-white ring-2 ring-pink-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70'}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">{icon}</span>
                <span className="font-bold">{label}</span>
                <span className="text-xs text-white/50 mt-1">{description}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mood Vibe Selector */}
        <div className="mb-10">
          <h2 className="text-2xl text-center mb-4">
            Pick Ur Vibe 🌈 {selectedMoodVibe && `(${MOOD_VIBES[selectedMoodVibe].label})`}
          </h2>
          <div className="flex justify-center space-x-4">
            {Object.entries(MOOD_VIBES).map(([key, { emoji, label }]) => (
              <motion.button
                key={key}
                onClick={() => handleMoodSelect(key)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  text-4xl p-4 rounded-full transition-all
                  ${selectedMoodVibe === key 
                    ? 'bg-orange-500 scale-110 ring-4 ring-pink-400' 
                    : 'bg-white/10 hover:bg-white/20'}
                `}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Journal Mode Container */}
        <AnimatePresence mode="wait">
          {mode === 'text' ? (
            <TextJournalMode 
              key="text-mode"
              onTextChange={setJournalContent}
              mood={selectedMoodVibe}
            />
          ) : (
            <VoiceJournalMode 
              key="voice-mode"
              onTranscriptChange={setJournalContent}
              mood={selectedMoodVibe}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JournalPage;
