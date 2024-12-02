import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdEmojiEmotions, 
  MdSentimentVerySatisfied, 
  MdSentimentDissatisfied, 
  MdSentimentNeutral,
  MdAdd,
  MdDelete,
  MdEdit,
  MdSave
} from 'react-icons/md';
import { FaSparkles, FaTrashAlt, FaMagic } from 'react-icons/fa';

// Playful Mood Emojis
const MOOD_EMOJIS = {
  'amazing': '🔥',
  'good': '😊',
  'okay': '🫤',
  'meh': '😴',
  'bad': '😭',
  'chaotic': '🌪️'
};

// Gen Z Slang Generator
const SLANG_GENERATOR = [
  "no cap, journal time 💅",
  "vibes check incoming 🌈",
  "spilling tea with myself 🫖",
  "main character energy activated ✨",
  "emotional support journal loading... 🚀"
];

// Random Background Gradients
const BACKGROUND_GRADIENTS = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-500 via-blue-500 to-pink-500',
  'from-green-400 via-cyan-500 to-blue-600',
  'from-orange-400 via-red-500 to-pink-500'
];

interface JournalEntry {
  id: string;
  content: string;
  mood: keyof typeof MOOD_EMOJIS;
  timestamp: number;
  isEditing?: boolean;
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [currentMood, setCurrentMood] = useState<keyof typeof MOOD_EMOJIS>('okay');
  const [backgroundGradient, setBackgroundGradient] = useState(BACKGROUND_GRADIENTS[0]);

  // Randomize background on page load
  useEffect(() => {
    const randomGradient = BACKGROUND_GRADIENTS[Math.floor(Math.random() * BACKGROUND_GRADIENTS.length)];
    setBackgroundGradient(randomGradient);
  }, []);

  // Slang Generator
  const getRandomSlang = () => {
    return SLANG_GENERATOR[Math.floor(Math.random() * SLANG_GENERATOR.length)];
  };

  // Add Journal Entry
  const addEntry = () => {
    if (newEntry.trim()) {
      const entry: JournalEntry = {
        id: `entry-${Date.now()}`,
        content: newEntry,
        mood: currentMood,
        timestamp: Date.now()
      };
      setEntries([entry, ...entries]);
      setNewEntry('');
    }
  };

  // Delete Entry
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Edit Entry
  const startEditingEntry = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, isEditing: true } : entry
    ));
  };

  // Save Edited Entry
  const saveEditedEntry = (id: string, newContent: string) => {
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { ...entry, content: newContent, isEditing: false } 
        : entry
    ));
  };

  // Filtered and Sorted Entries
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.timestamp - a.timestamp);
  }, [entries]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br ${backgroundGradient} text-white relative overflow-hidden p-4`}
    >
      {/* Chaotic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with Playful Slang */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60">
            emotional archive 🤫
          </h1>
          <p className="text-xl text-white/80 italic flex items-center justify-center gap-2">
            <FaSparkles className="text-yellow-300" />
            {getRandomSlang()}
            <FaSparkles className="text-yellow-300" />
          </p>
        </motion.header>

        {/* Mood and Entry Input */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10"
        >
          {/* Mood Selector */}
          <div className="flex justify-center space-x-4 mb-6">
            {(Object.keys(MOOD_EMOJIS) as Array<keyof typeof MOOD_EMOJIS>).map(mood => (
              <motion.button
                key={mood}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentMood(mood)}
                className={`
                  text-4xl p-2 rounded-full transition-all 
                  ${currentMood === mood 
                    ? 'bg-white/20 ring-2 ring-white/50' 
                    : 'hover:bg-white/10'}
                `}
              >
                {MOOD_EMOJIS[mood]}
              </motion.button>
            ))}
          </div>

          {/* Entry Input */}
          <div className="flex items-center space-x-4">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="what's on your mind? spill the tea... 🫖"
              className="w-full bg-black/20 text-white p-4 rounded-xl focus:ring-2 focus:ring-white/50 outline-none resize-none h-32"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={addEntry}
              className="bg-white/20 p-4 rounded-xl hover:bg-white/30 transition-all"
            >
              <MdAdd className="text-3xl" />
            </motion.button>
          </div>
        </motion.div>

        {/* Entries List */}
        <AnimatePresence>
          {sortedEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4 relative group"
            >
              {/* Mood Emoji */}
              <div className="absolute top-4 right-4 text-4xl">
                {MOOD_EMOJIS[entry.mood]}
              </div>

              {/* Entry Content */}
              {entry.isEditing ? (
                <div className="flex space-x-4">
                  <textarea
                    defaultValue={entry.content}
                    className="w-full bg-black/20 text-white p-2 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEditedEntry(entry.id, (e.target as HTMLTextAreaElement).value);
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => saveEditedEntry(entry.id, 
                      (document.querySelector(`textarea[defaultValue="${entry.content}"]`) as HTMLTextAreaElement).value
                    )}
                    className="bg-green-500/20 p-2 rounded-xl hover:bg-green-500/30"
                  >
                    <MdSave className="text-green-300" />
                  </motion.button>
                </div>
              ) : (
                <p className="text-white/90 mb-4">{entry.content}</p>
              )}

              {/* Entry Actions */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-white/50">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditingEntry(entry.id)}
                    className="bg-blue-500/20 p-2 rounded-xl hover:bg-blue-500/30"
                  >
                    <MdEdit className="text-blue-300" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteEntry(entry.id)}
                    className="bg-red-500/20 p-2 rounded-xl hover:bg-red-500/30"
                  >
                    <FaTrashAlt className="text-red-300" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JournalPage;
