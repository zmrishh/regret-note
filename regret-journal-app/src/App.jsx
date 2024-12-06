import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Page Imports
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import ConfessionsPage from './pages/ConfessionsPage';
import ChatbotPage from './pages/ChatbotPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';

// Component Imports
import { Navbar } from './components/Navigation/Navbar';
import { VentModeButton } from './components/VentMode/VentModeButton';
import { VentModeTextArea } from './components/VentMode/VentModeTextArea';

// Context Imports
import { StreakProvider } from './contexts/StreakContext';
import { VentModeProvider } from './contexts/VentModeContext';
import { GlobalConfessionProvider } from './contexts/GlobalConfessionContext';
import { ToastProvider } from './contexts/ToastContext';
import { JournalingModeProvider } from './contexts/JournalingModeContext';

function App() {
  console.log('App component rendering...');
  
  try {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to true for development
    const [userProfile, setUserProfile] = useState({
      username: 'DevUser',
      email: 'dev@example.com'
    });

    console.log('Authentication State:', { 
      isAuthenticated, 
      userProfile: userProfile ? 'Profile Exists' : 'No Profile' 
    });

    useEffect(() => {
      console.log('App component mounted');
      return () => console.log('App component will unmount');
    }, []);

    const handleAuthentication = (profile) => {
      console.log('Authentication successful:', profile);
      setUserProfile(profile);
      setIsAuthenticated(true);
    };

    const handleLogout = () => {
      console.log('Logging out...');
      setIsAuthenticated(false);
      setUserProfile(null);
    };

    return (
      <GlobalConfessionProvider>
        <StreakProvider>
          <VentModeProvider>
            <ToastProvider>
              <JournalingModeProvider>
                <BrowserRouter>
                  <div className="min-h-screen">
                    {isAuthenticated ? (
                      <>
                        {/* Navbar with logout functionality and username */}
                        <Navbar 
                          username={userProfile?.username || 'User'} 
                          onLogout={handleLogout} 
                        />

                        {/* Main Content Area with Top Padding to Accommodate Navbar */}
                        <main className="pt-20 min-h-screen">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/journal" element={<JournalPage />} />
                            <Route path="/confessions" element={<ConfessionsPage />} />
                            <Route path="/chatbot" element={<ChatbotPage />} />
                            <Route 
                              path="/profile" 
                              element={<ProfilePage userProfile={userProfile} />} 
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </main>

                        {/* Vent Mode Components */}
                        <VentModeButton />
                        <VentModeTextArea />
                      </>
                    ) : (
                      <AuthPage onAuthenticate={handleAuthentication} />
                    )}
                  </div>
                </BrowserRouter>
              </JournalingModeProvider>
            </ToastProvider>
          </VentModeProvider>
        </StreakProvider>
      </GlobalConfessionProvider>
    );
  } catch (error) {
    console.error('Critical error in App component:', error);
    return (
      <div className="min-h-screen bg-red-900 text-white flex items-center justify-center">
        <h1>Application Failed to Load</h1>
        <p>{error.toString()}</p>
      </div>
    );
  }
}

export default App;
