import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, 
  FaUserCircle, 
  FaBook, 
  FaGlobeAmericas, 
  FaQuoteLeft, 
  FaSave 
} from 'react-icons/fa';
import { StarsBackground } from '../components/ui/stars-background';
import { ShootingStars } from '../components/ui/shooting-stars';

// Mock data (replace with actual backend data later)
const generateMockInsights = (username) => [
  {
    id: 1,
    date: '2023-07-15',
    title: 'Toxic Trait Detox',
    content: 'Caught myself being my own villain and decided to yeet that energy out 💅',
    emotion: 'Slay Mode',
    color: 'bg-pink-500/20'
  },
  {
    id: 2,
    date: '2023-08-02',
    title: 'Glow Up Chronicles',
    content: 'Healing isn\'t linear, but my glow up is REAL. We stan self-growth! ✨',
    emotion: 'Unbothered',
    color: 'bg-purple-500/20'
  },
  {
    id: 3,
    date: '2023-08-20',
    title: 'No Cap Zone',
    content: 'Choosing violence... against my own self-doubt. We don\'t do that here! 🔥',
    emotion: 'Iconic',
    color: 'bg-green-500/20'
  }
];

const generateMockConfessions = (username) => [
  {
    id: 1,
    date: '2023-07-10',
    content: 'Low-key traumatized, but making it aesthetic AF 💁‍♀️',
    anonymity: 'full tea',
    location: 'Vibes Central',
    emotion: 'Mood'
  },
  {
    id: 2,
    date: '2023-08-05',
    content: 'Sometimes I\'m the main character, sometimes I\'m just an extra in my own life 🍿',
    anonymity: 'incognito mode',
    location: 'Plot Twist City',
    emotion: 'Plot Twist'
  }
];

export function ProfilePage({ userProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: userProfile.bio || "Living my best chaotic life 🌪️ | Professional overthinker 🧠 | Vibing through emotions",
    emotionalTrigger: userProfile.emotionalTrigger || "main character energy",
    anonymityPreference: userProfile.anonymityPreference || "low-key anonymous"
  });

  const [insights, setInsights] = useState(generateMockInsights(userProfile.username));
  const [confessions, setConfessions] = useState(generateMockConfessions(userProfile.username));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = () => {
    // In a real app, this would send data to backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <StarsBackground />
      <ShootingStars />
      <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <FaUserCircle className="w-16 h-16 text-accent-orange" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
                  {userProfile.username} 🌈
                </h1>
                <p className="text-white/70 text-sm">
                  {userProfile.email} | Chaos Coordinator 🎭
                </p>
              </div>
            </div>
            <motion.button
              onClick={toggleEditMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors flex items-center"
            >
              {isEditing ? (
                <>
                  <FaSave className="text-accent-orange mr-2" /> 
                  <span className="text-xs">Save the Vibe</span>
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> 
                  <span className="text-xs">Edit Persona</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Profile Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Bio and Settings */}
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaQuoteLeft className="mr-3 text-accent-orange" />
                Vibe Check 🕹️
              </h2>
              
              {isEditing ? (
                <>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                    rows={4}
                    placeholder="Drop your main character energy here... 💁‍♀️"
                  />
                  <div className="mt-4 space-y-2">
                    <label className="block text-white/70">Emotional Trigger (What makes you go 🤯)</label>
                    <input
                      name="emotionalTrigger"
                      value={profileData.emotionalTrigger}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                      placeholder="e.g. main character energy, existential memes"
                    />
                    <label className="block text-white/70 mt-2">Anonymity Level (How sus are we?)</label>
                    <select
                      name="anonymityPreference"
                      value={profileData.anonymityPreference}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                    >
                      <option value="low-key anonymous">Low-key Anonymous 🕶️</option>
                      <option value="full tea">Full Tea Spill 🫖</option>
                      <option value="no filter">No Filter Zone 🚫</option>
                    </select>
                  </div>
                  <button 
                    onClick={saveProfile}
                    className="mt-4 w-full bg-accent-orange text-white p-2 rounded-lg hover:bg-accent-orange/80 transition-colors flex items-center justify-center"
                  >
                    <FaSave className="mr-2" /> Seal the Vibe ✨
                  </button>
                </>
              ) : (
                <>
                  <p className="text-white/70 mb-4 italic">"{profileData.bio}"</p>
                  <div className="space-y-2">
                    <p>
                      <span className="text-white/50">Emotional Trigger:</span>{' '}
                      <span className="text-accent-orange font-bold">{profileData.emotionalTrigger} 🌪️</span>
                    </p>
                    <p>
                      <span className="text-white/50">Anonymity:</span>{' '}
                      <span className="text-accent-orange font-bold">{profileData.anonymityPreference} 🕶️</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Emotional Stats */}
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaBook className="mr-3 text-accent-orange" />
                Emotional Rollercoaster 🎢
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Total Chaos Logged</span>
                  <span className="text-accent-orange font-bold text-lg bg-white/10 px-3 py-1 rounded-full">
                    {insights.length + confessions.length} 💥
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Emotional Range</span>
                  <span className="text-accent-orange font-bold text-lg bg-white/10 px-3 py-1 rounded-full">
                    Absolutely Chaotic 🌪️
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vibe Check Status</span>
                  <span className="text-accent-orange font-bold text-lg bg-white/10 px-3 py-1 rounded-full">
                    Peak Authenticity 💯
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Past Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FaBook className="mr-3 text-accent-orange" />
              Past Insights
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  whileHover={{ scale: 1.05 }}
                  className={`${insight.color} p-4 rounded-2xl border border-white/10`}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">{insight.date}</span>
                    <span className="text-sm text-white/70">{insight.emotion}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{insight.title}</h3>
                  <p className="text-white/70">{insight.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Global Confessions */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FaGlobeAmericas className="mr-3 text-accent-orange" />
              Global Confessions
            </h2>
            <div className="space-y-4">
              {confessions.map((confession) => (
                <motion.div
                  key={confession.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">{confession.date}</span>
                    <span className="text-sm text-white/70">
                      {confession.anonymity === 'full' ? 'Anonymous' : 'Partially Visible'}
                    </span>
                  </div>
                  <p className="text-white/80 italic">"{confession.content}"</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-white/50">
                      <FaGlobeAmericas className="inline mr-2" />
                      {confession.location}
                    </span>
                    <span className="text-sm text-accent-orange">
                      {confession.emotion}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
