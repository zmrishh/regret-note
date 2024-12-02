import React, { createContext, useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFire, 
  FaGem, 
  FaTrophy, 
  FaStar, 
  FaLevelUpAlt 
} from 'react-icons/fa';

// Streak Levels and Rewards
const STREAK_LEVELS = [
  { level: 1, name: 'Emotional Novice', minStreak: 0, icon: FaStar },
  { level: 2, name: 'Feeling Finder', minStreak: 3, icon: FaGem },
  { level: 3, name: 'Emotion Explorer', minStreak: 7, icon: FaTrophy },
  { level: 4, name: 'Vibe Master', minStreak: 14, icon: FaLevelUpAlt },
  { level: 5, name: 'Emotional Guru', minStreak: 30, icon: FaFire }
];

// Create the Streak Context
const StreakContext = createContext(null);

// Streak Provider Component
export const StreakProvider = ({ children }) => {
  // Initialize streaks from localStorage or with default values
  const [streaks, setStreaks] = useState(() => {
    const savedStreaks = localStorage.getItem('emotionalStreaks');
    return savedStreaks 
      ? JSON.parse(savedStreaks) 
      : {
          regret: { 
            count: 0, 
            lastEntryDate: null,
            consecutiveDays: 0,
            level: 1,
            totalPoints: 0
          },
          feelingFine: { 
            count: 0, 
            lastEntryDate: null,
            consecutiveDays: 0,
            level: 1,
            totalPoints: 0
          }
        };
  });

  // Update streaks when they change
  useEffect(() => {
    localStorage.setItem('emotionalStreaks', JSON.stringify(streaks));
  }, [streaks]);

  // Method to calculate streak level
  const calculateStreakLevel = (consecutiveDays) => {
    const level = STREAK_LEVELS.reduce((current, levelConfig) => 
      consecutiveDays >= levelConfig.minStreak ? levelConfig : current
    , STREAK_LEVELS[0]);
    return level;
  };

  // Method to update streak
  const updateStreak = (emotion, date = new Date()) => {
    setStreaks(prevStreaks => {
      const formattedDate = date.toISOString().split('T')[0];
      
      // Check if this is a consecutive day
      const isConsecutiveDay = prevStreaks[emotion].lastEntryDate 
        ? isNextDay(prevStreaks[emotion].lastEntryDate, formattedDate)
        : true;

      const newConsecutiveDays = isConsecutiveDay 
        ? prevStreaks[emotion].consecutiveDays + 1 
        : 1;

      const newLevel = calculateStreakLevel(newConsecutiveDays);
      
      return {
        ...prevStreaks,
        [emotion]: {
          count: prevStreaks[emotion].count + 1,
          lastEntryDate: formattedDate,
          consecutiveDays: newConsecutiveDays,
          level: newLevel.level,
          totalPoints: prevStreaks[emotion].totalPoints + 
            (isConsecutiveDay ? newConsecutiveDays : 1)
        }
      };
    });
  };

  // Method to reset a specific streak
  const resetStreak = (emotion) => {
    setStreaks(prevStreaks => ({
      ...prevStreaks,
      [emotion]: { 
        count: 0, 
        lastEntryDate: null,
        consecutiveDays: 0,
        level: 1,
        totalPoints: 0
      }
    }));
  };

  // Render Streak Level Component
  const StreakLevelDisplay = ({ emotion }) => {
    const currentStreak = streaks[emotion];
    const currentLevel = STREAK_LEVELS.find(l => l.level === currentStreak.level);
    const LevelIcon = currentLevel.icon;

    return (
      <motion.div 
        className="flex items-center space-x-2 bg-white/10 p-2 rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <LevelIcon 
          className={`
            text-2xl 
            ${emotion === 'regret' ? 'text-red-400' : 'text-green-400'}
          `} 
        />
        <div>
          <p className="text-sm font-bold text-white">
            {currentLevel.name}
          </p>
          <p className="text-xs text-white/70">
            Streak: {currentStreak.consecutiveDays} days
          </p>
        </div>
      </motion.div>
    );
  };

  // Helper function to check if a date is the next day
  const isNextDay = (lastDate, currentDate) => {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const nextDay = new Date(last);
    nextDay.setDate(last.getDate() + 1);
    
    return (
      nextDay.getFullYear() === current.getFullYear() &&
      nextDay.getMonth() === current.getMonth() &&
      nextDay.getDate() === current.getDate()
    );
  };

  return (
    <StreakContext.Provider value={{ 
      streaks, 
      updateStreak, 
      resetStreak,
      StreakLevelDisplay,
      STREAK_LEVELS
    }}>
      {children}
    </StreakContext.Provider>
  );
};

// Custom hook to use the Streak Context
export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

export default StreakContext;
