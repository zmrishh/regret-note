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

// Mock data (replace with actual backend data later)
const generateMockInsights = (username) => [
  {
    id: 1,
    date: '2023-07-15',
    title: 'Overcoming Fear',
    content: 'Today, I realized that my fear of failure has been holding me back from pursuing my dreams.',
    emotion: 'Hopeful',
    color: 'bg-blue-500/20'
  },
  {
    id: 2,
    date: '2023-08-02',
    title: 'Letting Go',
    content: 'Learned that holding onto past regrets only prevents me from growing and moving forward.',
    emotion: 'Reflective',
    color: 'bg-purple-500/20'
  },
  {
    id: 3,
    date: '2023-08-20',
    title: 'Self-Compassion',
    content: 'I\'m learning to be kinder to myself and understand that mistakes are part of human experience.',
    emotion: 'Peaceful',
    color: 'bg-green-500/20'
  }
];

const generateMockConfessions = (username) => [
  {
    id: 1,
    date: '2023-07-10',
    content: 'I\'ve been carrying the weight of a decision I made years ago that changed the course of my life.',
    anonymity: 'partial',
    location: 'New York, USA',
    emotion: 'Regretful'
  },
  {
    id: 2,
    date: '2023-08-05',
    content: 'Sometimes I wonder if I\'m living the life I truly want or the life others expect of me.',
    anonymity: 'full',
    location: 'London, UK',
    emotion: 'Contemplative'
  }
];

export function ProfilePage({ userProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: userProfile.bio || "An emotional explorer, seeking understanding and growth.",
    emotionalTrigger: userProfile.emotionalTrigger || "hope",
    anonymityPreference: userProfile.anonymityPreference || "partial"
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
    <div className="container mx-auto px-4 py-8 text-white">
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
                {userProfile.username}
              </h1>
              <p className="text-white/70">{userProfile.email}</p>
            </div>
          </div>
          <motion.button
            onClick={toggleEditMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
          >
            {isEditing ? <FaSave className="text-accent-orange" /> : <FaEdit />}
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
              Bio & Settings
            </h2>
            
            {isEditing ? (
              <>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                  rows={4}
                />
                <div className="mt-4 space-y-2">
                  <label className="block text-white/70">Emotional Trigger</label>
                  <input
                    name="emotionalTrigger"
                    value={profileData.emotionalTrigger}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                  />
                  <label className="block text-white/70 mt-2">Anonymity Preference</label>
                  <select
                    name="anonymityPreference"
                    value={profileData.anonymityPreference}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-accent-orange"
                  >
                    <option value="full">Full Anonymity</option>
                    <option value="partial">Partial Anonymity</option>
                    <option value="none">No Anonymity</option>
                  </select>
                </div>
                <button 
                  onClick={saveProfile}
                  className="mt-4 w-full bg-accent-orange text-white p-2 rounded-lg hover:bg-accent-orange/80 transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <p className="text-white/70 mb-4">{profileData.bio}</p>
                <div className="space-y-2">
                  <p>
                    <span className="text-white/50">Emotional Trigger:</span>{' '}
                    <span className="text-accent-orange">{profileData.emotionalTrigger}</span>
                  </p>
                  <p>
                    <span className="text-white/50">Anonymity:</span>{' '}
                    {profileData.anonymityPreference}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Emotional Stats */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBook className="mr-3 text-accent-orange" />
              Emotional Journey
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Insights</span>
                <span className="text-accent-orange">{insights.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Confessions</span>
                <span className="text-accent-orange">{confessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Emotional Range</span>
                <span className="text-accent-orange">Diverse</span>
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
  );
}
