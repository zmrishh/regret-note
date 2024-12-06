import React, { createContext, useContext, useState } from 'react';

const JournalingModeContext = createContext(null);

export const JournalingModeProvider = ({ children }) => {
  const [journalingMode, setJournalingMode] = useState(null);

  const startJournalingMode = (mode) => {
    setJournalingMode(mode);
  };

  const resetJournalingMode = () => {
    setJournalingMode(null);
  };

  return (
    <JournalingModeContext.Provider 
      value={{ 
        journalingMode, 
        startJournalingMode, 
        resetJournalingMode 
      }}
    >
      {children}
    </JournalingModeContext.Provider>
  );
};

export const useJournalingMode = () => {
  const context = useContext(JournalingModeContext);
  if (!context) {
    throw new Error('useJournalingMode must be used within a JournalingModeProvider');
  }
  return context;
};
