import React, { createContext, useState, useContext, useEffect } from 'react';

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
            consecutiveDays: 0
          },
          feelingFine: { 
            count: 0, 
            lastEntryDate: null,
            consecutiveDays: 0
          }
        };
  });

  // Update streaks when they change
  useEffect(() => {
    localStorage.setItem('emotionalStreaks', JSON.stringify(streaks));
  }, [streaks]);

  // Method to update streak
  const updateStreak = (emotion, date = new Date()) => {
    setStreaks(prevStreaks => {
      const formattedDate = date.toISOString().split('T')[0];
      
      // Check if this is a consecutive day
      const isConsecutiveDay = prevStreaks[emotion].lastEntryDate 
        ? isNextDay(prevStreaks[emotion].lastEntryDate, formattedDate)
        : true;

      return {
        ...prevStreaks,
        [emotion]: {
          count: prevStreaks[emotion].count + 1,
          lastEntryDate: formattedDate,
          consecutiveDays: isConsecutiveDay 
            ? prevStreaks[emotion].consecutiveDays + 1 
            : 1
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
        consecutiveDays: 0
      }
    }));
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
      resetStreak 
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
