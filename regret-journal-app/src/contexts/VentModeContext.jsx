import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const VentModeContext = createContext(null);

export const VentModeProvider = ({ children }) => {
  // Vent mode state
  const [isVentModeActive, setIsVentModeActive] = useState(false);
  const [ventEntry, setVentEntry] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef(null);

  // Start vent mode with configurable options
  const startVentMode = (options = {}) => {
    const {
      duration = 10 * 60, // Default 10 minutes
      selfDestructTime = 24 * 60 * 60, // Default 24 hours
      anonymityLevel = 'high' // 'low', 'medium', 'high'
    } = options;

    // Reset previous timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Initialize vent entry
    const newEntry = {
      id: `vent-${Date.now()}`,
      content: '',
      createdAt: Date.now(),
      expiresAt: Date.now() + (selfDestructTime * 1000),
      anonymityLevel,
      status: 'active'
    };

    setVentEntry(newEntry);
    setTimeRemaining(duration);
    setIsVentModeActive(true);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - lock the entry
          clearInterval(timerRef.current);
          setIsVentModeActive(false);
          lockVentEntry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Update vent entry content
  const updateVentEntry = (content) => {
    if (isVentModeActive) {
      setVentEntry(prev => ({
        ...prev,
        content
      }));
    }
  };

  // Lock the vent entry when time expires
  const lockVentEntry = () => {
    if (ventEntry) {
      setVentEntry(prev => ({
        ...prev,
        status: 'locked',
        lockedAt: Date.now()
      }));

      // Optional: Save to storage or backend
      saveVentEntry(ventEntry);
    }
  };

  // Save vent entry (could be expanded to save to backend)
  const saveVentEntry = (entry) => {
    try {
      // Store in localStorage with expiration
      const ventEntries = JSON.parse(localStorage.getItem('ventEntries') || '[]');
      ventEntries.push(entry);
      
      // Clean up expired entries
      const currentTime = Date.now();
      const validEntries = ventEntries.filter(e => e.expiresAt > currentTime);
      
      localStorage.setItem('ventEntries', JSON.stringify(validEntries));
    } catch (error) {
      console.error('Error saving vent entry:', error);
    }
  };

  // Cancel vent mode
  const cancelVentMode = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsVentModeActive(false);
    setVentEntry(null);
    setTimeRemaining(0);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Check and remove expired entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const ventEntries = JSON.parse(localStorage.getItem('ventEntries') || '[]');
      const currentTime = Date.now();
      const validEntries = ventEntries.filter(e => e.expiresAt > currentTime);
      
      if (validEntries.length !== ventEntries.length) {
        localStorage.setItem('ventEntries', JSON.stringify(validEntries));
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <VentModeContext.Provider value={{
      isVentModeActive,
      ventEntry,
      timeRemaining,
      startVentMode,
      updateVentEntry,
      cancelVentMode,
      lockVentEntry
    }}>
      {children}
    </VentModeContext.Provider>
  );
};

// Custom hook to use Vent Mode context
export const useVentMode = () => {
  const context = useContext(VentModeContext);
  if (!context) {
    throw new Error('useVentMode must be used within a VentModeProvider');
  }
  return context;
};
