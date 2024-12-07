import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPencilAlt, FaMicrophone } from 'react-icons/fa';
import { StarsBackground } from '../components/ui/stars-background';
import { ShootingStars } from '../components/ui/shooting-stars';
import { useJournalingMode } from '../contexts/JournalingModeContext';
import { BentoCard, BentoGrid } from '../components/ui/bento-grid';
import { useToast } from '../contexts/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startJournalingMode } = useJournalingMode();
  const [entries, setEntries] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  // Refresh entries when returning from JournalPage
  useEffect(() => {
    if (location.state?.refresh) {
      fetchEntries();
      // Clear the refresh state
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/entries');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      // Transform backend data to match frontend format
      const transformedEntries = data.map(entry => ({
        id: entry.id,
        content: entry.content,
        mode: entry.mood === 'feeling-fine' ? 'feeling-fine' : 'major-facepalm',
        type: entry.entry_type || 'text',
        date: new Date(entry.created_at).toLocaleDateString(),
        intensity: entry.intensity
      }));
      setEntries(transformedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      showToast('Failed to load entries', 'error');
    }
  };

  const handleModeSelect = (mode) => {
    startJournalingMode(mode);
    navigate('/journal');
  };

  const getEntryBackground = (entry) => {
    const modeColors = {
      'feeling-fine': 'from-green-500/20 to-green-600/20',
      'major-facepalm': 'from-red-500/20 to-red-600/20'
    };

    return (
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${modeColors[entry.mode]} 
          opacity-20 transition-all duration-300 group-hover:opacity-40
        `}
      />
    );
  };

  const renderJournalEntries = () => {
    return entries.map((entry, index) => (
      <BentoCard
        key={entry.id}
        name={`${entry.mode === 'feeling-fine' ? '🌞' : '😖'} ${entry.date}`}
        description={entry.content}
        href="/journal"
        cta="View Entry"
        Icon={entry.type === 'text' ? FaPencilAlt : FaMicrophone}
        background={getEntryBackground(entry)}
        className={`
          ${index === 0 ? 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3' : ''}
          ${index === 1 ? 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3' : ''}
          ${index === 2 ? 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2' : ''}
          ${index === 3 ? 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4' : ''}
          ${index === 4 ? 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4' : ''}
        `}
      />
    ));
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
        <StarsBackground />
        <ShootingStars />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-8 py-12">
        {/* Mode Selection Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-12">
            How are you feeling today? ☕
          </h1>

          {/* Mode Selection Buttons */}
          <div className="flex justify-center space-x-8 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeSelect('feeling-fine')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-xl text-2xl font-bold flex items-center space-x-4 transition-all"
            >
              <span>🌞</span>
              <span>Feeling Fine</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeSelect('major-facepalm')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-xl text-2xl font-bold flex items-center space-x-4 transition-all"
            >
              <span>😖</span>
              <span>Major Facepalm</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Journal Entries Bento Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoGrid className="lg:grid-rows-3">
            {renderJournalEntries()}
          </BentoGrid>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
