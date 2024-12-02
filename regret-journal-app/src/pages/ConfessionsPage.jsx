import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker 
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { 
  FaShareAlt,
  FaFilter
} from 'react-icons/fa';
import { 
  MdEmojiEmotions, 
  MdPrivacyTip, 
  MdReportProblem 
} from 'react-icons/md';

// Fallback earth texture as a data URL
const EARTH_TEXTURE_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEAAQADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AA//Z';

// Texture and Map Imports
import worldTopoJson from '../assets/world-topo.json';

// Spicy Gen Z Confessions Generator
const SPICY_CONFESSIONS = [
  {
    id: 'ultra-cringe',
    content: "I accidentally liked my ex's Instagram post from 3 years ago 💀",
    emotion: "Embarrassment 🙈",
    location: "United States",
    coordinates: [-98.5, 39.8],
    anonymity: "Maximum Stealth Mode"
  },
  {
    id: 'main-character',
    content: "Pretended to be busy during a group project but was just binge-watching Netflix 🍿",
    emotion: "Zero Guilt 😎",
    location: "United Kingdom",
    coordinates: [-2.2, 54.5],
    anonymity: "Peak Invisibility"
  },
  {
    id: 'unhinged',
    content: "Ghosted my entire friend group because group chat was too chaotic 🚫",
    emotion: "Chaos Vibes 🌪️",
    location: "Australia",
    coordinates: [133.7, -25.2],
    anonymity: "Anonymous Legend"
  }
];

const ConfessionsPage = () => {
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [filter, setFilter] = useState({
    emotion: '',
    location: '',
    anonymity: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [confessionMode, setConfessionMode] = useState('global');

  // Combine mock and spicy confessions
  const allConfessions = [
    ...SPICY_CONFESSIONS,
    {
      id: 1,
      content: "I regret not spending more time with my family.",
      emotion: "Regret",
      location: "United States",
      anonymity: "High",
      timestamp: new Date(),
      coordinates: [-74, 40.7]
    },
    {
      id: 2,
      content: "Sometimes I wonder about the paths not taken.",
      emotion: "Contemplative",
      location: "Canada",
      anonymity: "Medium",
      timestamp: new Date(),
      coordinates: [0, 51.5]
    },
    {
      id: 3,
      content: "I'm learning to forgive myself for past mistakes.",
      emotion: "Hopeful",
      location: "United Kingdom",
      anonymity: "Low",
      timestamp: new Date(),
      coordinates: [0, 51.5]
    },
    {
      id: 4,
      content: "The weight of unspoken words haunts me.",
      emotion: "Sad",
      location: "Australia",
      anonymity: "High",
      timestamp: new Date(),
      coordinates: [0, 51.5]
    },
    {
      id: 5,
      content: "I'm frustrated with the choices I've made.",
      emotion: "Angry",
      location: "Germany",
      anonymity: "Medium",
      timestamp: new Date(),
      coordinates: [0, 51.5]
    }
  ];

  const filteredConfessions = useMemo(() => {
    return allConfessions.filter(confession => 
      confession.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allConfessions]);

  const getRandomSlang = () => {
    const slangs = [
      "spill the tea, no cap 🫖",
      "confessions go brr 🚀",
      "vibes are immaculate rn 💅",
      "we're all just living our best chaotic life 🌪️",
      "anonymous storytelling hits different 🤫"
    ];
    return slangs[Math.floor(Math.random() * slangs.length)];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white relative overflow-hidden p-4"
    >
      {/* Chaotic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Slang */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Confession Chronicles 🤫
          </h1>
          <p className="text-xl text-white/80 italic">
            {getRandomSlang()}
          </p>
        </motion.header>

        {/* Confession Mode Selector */}
        <div className="flex justify-center space-x-4 mb-10">
          {[
            { id: 'global', icon: '🌍', label: 'Global Vibes' },
            { id: 'local', icon: '📍', label: 'Local Tea' },
            { id: 'anonymous', icon: '🕵️', label: 'Stealth Mode' }
          ].map(mode => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfessionMode(mode.id)}
              className={`
                px-6 py-3 rounded-xl backdrop-blur-sm transition-all
                ${confessionMode === mode.id 
                  ? 'bg-orange-500 text-white ring-2 ring-pink-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70'}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">{mode.icon}</span>
                <span className="font-bold">{mode.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Interactive World Map */}
        <div className="w-full h-[600px] bg-white/10 rounded-xl overflow-hidden mb-10">
          <ComposableMap 
            projection="geoMercator"
            projectionConfig={{
              center: [0, 20],
              scale: 147
            }}
            width={800}
            height={600}
            className="w-full h-full"
          >
            <Geographies geography={worldTopoJson}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.id}
                    geography={geo}
                    fill="#1E293B"
                    stroke="#334155"
                    strokeWidth={0.5}
                    className="hover:fill-pink-900/50 transition-colors"
                  />
                ))
              }
            </Geographies>

            {/* Confession Markers */}
            {filteredConfessions.map((confession) => (
              <Marker 
                key={confession.id}
                coordinates={confession.coordinates}
                onClick={() => setSelectedConfession(confession)}
              >
                <motion.circle
                  r={10}
                  fill="#FF6B6B"
                  stroke="#FCA5A5"
                  strokeWidth={3}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Confession Details Modal */}
        {selectedConfession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedConfession(null)}
          >
            <motion.div
              className="bg-white/10 p-8 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-pink-400">
                Confession Details 🕵️‍♀️
              </h2>
              <p className="italic text-white mb-4">"{selectedConfession.content}"</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-green-300 flex items-center">
                    <MdEmojiEmotions className="mr-2" /> Emotion
                  </span>
                  <p>{selectedConfession.emotion}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-300 flex items-center">
                    <MdPrivacyTip className="mr-2" /> Anonymity
                  </span>
                  <p>{selectedConfession.anonymity}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-300 flex items-center">
                    <FaFilter className="mr-2" /> Location
                  </span>
                  <p>{selectedConfession.location}</p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                  onClick={() => {
                    // Share logic
                    navigator.clipboard.writeText(selectedConfession.content);
                    alert('Confession copied to clipboard! 📋');
                  }}
                >
                  <FaShareAlt className="mr-2" /> Share
                </button>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600"
                  onClick={() => {
                    // Report logic
                    alert('Confession reported. Our team will review it. 🚨');
                  }}
                >
                  <MdReportProblem className="mr-2" /> Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Spicy Confessions Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 bg-white/10 p-6 rounded-xl"
        >
          <h2 className="text-3xl mb-4 text-pink-400">
            Trending Confessions 🔥
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SPICY_CONFESSIONS.map(confession => (
              <motion.div
                key={confession.id}
                whileHover={{ scale: 1.05 }}
                className="bg-black/50 p-4 rounded-lg"
              >
                <p className="text-white italic mb-2">"{confession.content}"</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-300">{confession.emotion}</span>
                  <span className="text-blue-300">{confession.anonymity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ConfessionsPage;
