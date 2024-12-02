import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGlobeAmericas, 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaEye, 
  FaHeart, 
  FaCompass,
  FaChartPie,
  FaLanguage,
  FaUsers,
  FaChartBar
} from 'react-icons/fa';

// Fallback earth texture as a data URL
const EARTH_TEXTURE_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEAAQADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AA//Z';

// Texture and Map Imports
import worldTopoJson from '../assets/world-topo.json';

// Marker Component with Popup
function ConfessionMarker({ position, confession, onSelect }) {
  const [showPopup, setShowPopup] = useState(false);
  const meshRef = useRef();

  const handlePointerEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    document.body.style.cursor = 'default';
  };

  const handleClick = () => {
    setShowPopup(!showPopup);
    onSelect(confession);
  };

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
      
      {showPopup && (
        <Html position={[0.1, 0.1, 0.1]}>
          <div className="bg-white/90 p-2 rounded-lg shadow-lg text-black text-sm max-w-[200px]">
            <p>{confession.content}</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">{confession.emotion}</span>
              <span className="text-xs text-gray-500">{confession.location}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function EarthSphere({ confessions, onMarkerSelect }) {
  const meshRef = useRef();
  const { scene } = useThree();

  // Predefined marker positions (longitude, latitude)
  const markerPositions = [
    { coords: [0, 0], confession: confessions[0] },      // London
    { coords: [-74, 40.7], confession: confessions[1] }, // New York
    { coords: [139.6917, 35.6895], confession: confessions[2] }, // Tokyo
    { coords: [-99.1332, 19.4326], confession: confessions[3] }, // Mexico City
    { coords: [151.2093, -33.8688], confession: confessions[4] }, // Sydney
    { coords: [18.4241, -33.9249], confession: confessions[5] }, // Cape Town
    { coords: [55.2708, 25.2048], confession: confessions[6] }, // Dubai
    { coords: [103.8198, 1.3521], confession: confessions[7] }, // Singapore
    { coords: [-58.3816, -34.6037], confession: confessions[8] }, // Buenos Aires
    { coords: [37.6173, 55.7558], confession: confessions[9] }   // Moscow
  ];

  // Convert geographic coordinates to 3D sphere coordinates
  const getPosition = (lon, lat) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    return [
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ];
  };

  useEffect(() => {
    // Create a simple procedural texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Create a gradient background
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#1A535C');     // Dark blue
    gradient.addColorStop(0.5, '#4ECDC4');   // Teal
    gradient.addColorStop(1, '#FF6B6B');     // Coral

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise
    for (let i = 0; i < 1000; i++) {
      context.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
      context.fillRect(
        Math.random() * canvas.width, 
        Math.random() * canvas.height, 
        Math.random() * 3, 
        Math.random() * 3
      );
    }

    const texture = new THREE.CanvasTexture(canvas);
    
    if (meshRef.current) {
      meshRef.current.material.map = texture;
      meshRef.current.material.needsUpdate = true;
    }

    return () => {
      texture.dispose();
    };
  }, []);

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>

      {markerPositions.map((marker, index) => (
        <ConfessionMarker 
          key={index}
          position={getPosition(marker.coords[0], marker.coords[1])}
          confession={marker.confession}
          onSelect={onMarkerSelect}
        />
      ))}
    </group>
  );
}

const ConfessionPin = ({ position, confession }) => {
  const [hover, setHover] = useState(false);

  return (
    <mesh 
      position={position} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={hover ? 'red' : 'orange'} />
      
      {hover && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 0.5, 0.1]} />
          <meshBasicMaterial color="black" opacity={0.8} transparent />
        </mesh>
      )}
    </mesh>
  );
};

const ConfessionsPage = () => {
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [filter, setFilter] = useState({
    emotion: '',
    location: '',
    anonymity: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const mockConfessions = [
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

  const [confessions, setConfessions] = useState(mockConfessions);
  const [filteredConfessions, setFilteredConfessions] = useState(mockConfessions);

  const filteredConfessionsList = confessions.filter(confession => {
    const matchesEmotion = !filter.emotion || confession.emotion === filter.emotion;
    const matchesLocation = !filter.location || confession.location.includes(filter.location);
    const matchesAnonymity = !filter.anonymity || confession.anonymity === filter.anonymity;
    const matchesSearch = !searchTerm || confession.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesEmotion && matchesLocation && matchesAnonymity && matchesSearch;
  });

  // Emotion Analysis Component
  const EmotionAnalytics = ({ confessions }) => {
    const emotionDistribution = confessions.reduce((acc, confession) => {
      acc[confession.emotion] = (acc[confession.emotion] || 0) + 1;
      return acc;
    }, {});

    const totalConfessions = confessions.length;

    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartPie className="mr-3 text-accent-orange" />
          Emotion Insights
        </h3>
        <div className="space-y-2">
          {Object.entries(emotionDistribution).map(([emotion, count]) => (
            <div key={emotion} className="flex items-center">
              <div 
                className="h-2 mr-2 rounded-full"
                style={{ 
                  width: `${(count / totalConfessions) * 100}%`,
                  backgroundColor: getEmotionColor(emotion)
                }}
              />
              <span className="text-sm text-white/70">
                {emotion}: {count} ({((count / totalConfessions) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Language Detection Component
  const LanguageInsights = ({ confessions }) => {
    const [detectedLanguages, setDetectedLanguages] = useState({});

    useEffect(() => {
      // Simulated language detection 
      // In a real app, use a language detection library
      const languages = confessions.reduce((acc, confession) => {
        const lang = detectLanguage(confession.content);
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});
      setDetectedLanguages(languages);
    }, [confessions]);

    // Mock language detection function
    const detectLanguage = (text) => {
      const languagePatterns = {
        'English': /\b(the|and|is|at|which|on)\b/i,
        'Spanish': /\b(el|la|de|que|en|y)\b/i,
        'French': /\b(le|la|de|des|et|dans)\b/i
      };

      for (const [lang, regex] of Object.entries(languagePatterns)) {
        if (regex.test(text)) return lang;
      }
      return 'Other';
    };

    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaLanguage className="mr-3 text-accent-orange" />
          Language Diversity
        </h3>
        <div className="space-y-2">
          {Object.entries(detectedLanguages).map(([language, count]) => (
            <div key={language} className="flex items-center">
              <FaGlobeAmericas className="mr-2 text-white/50" />
              <span className="text-sm text-white/70">
                {language}: {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Community Engagement Component
  const CommunityStats = ({ confessions }) => {
    const [communityMetrics, setCommunityMetrics] = useState({
      totalConfessions: 0,
      uniqueLocations: 0,
      mostCommonLocation: '',
      averageWordCount: 0
    });

    useEffect(() => {
      const locations = new Set(confessions.map(c => c.location));
      const totalWordCount = confessions.reduce((sum, confession) => 
        sum + (confession.content.split(/\s+/).length), 0);

      setCommunityMetrics({
        totalConfessions: confessions.length,
        uniqueLocations: locations.size,
        mostCommonLocation: getMostCommonLocation(confessions),
        averageWordCount: Math.round(totalWordCount / confessions.length)
      });
    }, [confessions]);

    const getMostCommonLocation = (confessions) => {
      const locationCounts = confessions.reduce((acc, confession) => {
        acc[confession.location] = (acc[confession.location] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(locationCounts).reduce((a, b) => 
        b[1] > (a[1] || 0) ? b : a, [])[0] || 'N/A';
    };

    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaUsers className="mr-3 text-accent-orange" />
          Community Insights
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-sm text-white/50">Total Confessions</span>
            <p className="text-lg text-white">{communityMetrics.totalConfessions}</p>
          </div>
          <div>
            <span className="text-sm text-white/50">Unique Locations</span>
            <p className="text-lg text-white">{communityMetrics.uniqueLocations}</p>
          </div>
          <div>
            <span className="text-sm text-white/50">Most Common Location</span>
            <p className="text-lg text-white">{communityMetrics.mostCommonLocation}</p>
          </div>
          <div>
            <span className="text-sm text-white/50">Avg. Words per Confession</span>
            <p className="text-lg text-white">{communityMetrics.averageWordCount}</p>
          </div>
        </div>
      </div>
    );
  };

  // Emotional Wave Visualization
  const EmotionalWave = ({ confessions }) => {
    const [emotionalTrend, setEmotionalTrend] = useState([]);

    useEffect(() => {
      // Simulate emotional trend over time
      const trend = confessions.map((confession, index) => ({
        x: index,
        y: getEmotionalIntensity(confession.emotion)
      }));
      setEmotionalTrend(trend);
    }, [confessions]);

    const getEmotionalIntensity = (emotion) => {
      const intensityMap = {
        'Regret': 0.8,
        'Contemplative': 0.6,
        'Hopeful': 0.4,
        'Sad': 0.7,
        'Angry': 0.9,
        'default': 0.5
      };
      return intensityMap[emotion] || intensityMap['default'];
    };

    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartBar className="mr-3 text-accent-orange" />
          Emotional Wave
        </h3>
        <div className="w-full h-32 relative">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {emotionalTrend.map((point, index) => (
              <circle 
                key={index} 
                cx={point.x * 10} 
                cy={50 - point.y * 40} 
                r="2" 
                fill={getEmotionColor(Object.keys(getEmotionalIntensity)[index])} 
              />
            ))}
            {emotionalTrend.length > 1 && (
              <path
                d={`M ${emotionalTrend.map((p, i) => `${i * 10},${50 - p.y * 40}`).join(' L ')}`}
                fill="none"
                stroke="rgba(255,107,107,0.5)"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
      </div>
    );
  };

  // Helper function to get emotion color
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      'Regret': '#FF6B6B',
      'Contemplative': '#4ECDC4',
      'Hopeful': '#45B7D1',
      'Sad': '#1A535C',
      'Angry': '#FF9F1C',
      'default': '#6A5ACD'
    };
    return emotionColors[emotion] || emotionColors['default'];
  };

  const handleMarkerSelect = (confession) => {
    setSelectedConfession(confession);
  };

  return (
    <div className="min-h-screen bg-off-black text-white">
      <div className="grid md:grid-cols-3 h-screen">
        {/* Globe Visualization */}
        <div className="md:col-span-2 relative">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <EarthSphere 
                confessions={confessions} 
                onMarkerSelect={handleMarkerSelect} 
              />
              <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} />
              <OrbitControls enableZoom={true} />
              
              {/* Confession Pins */}
              {filteredConfessionsList.map((confession, index) => (
                <ConfessionPin 
                  key={confession.id}
                  position={[
                    2 * Math.cos(confession.coordinates[0] * Math.PI / 180) * Math.cos(confession.coordinates[1] * Math.PI / 180),
                    2 * Math.sin(confession.coordinates[1] * Math.PI / 180),
                    2 * Math.sin(confession.coordinates[0] * Math.PI / 180) * Math.cos(confession.coordinates[1] * Math.PI / 180)
                  ]}
                  confession={confession}
                />
              ))}
            </Suspense>
          </Canvas>
        </div>

        {/* Confession Sidebar */}
        <div className="bg-white/10 p-6 overflow-y-auto">
          {/* Filters */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaCompass className="mr-3 text-accent-orange" />
              Global Confessions
            </h2>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search confessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 p-3 rounded-lg pl-10 border border-white/20 focus:ring-2 focus:ring-accent-orange"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Emotion Filter */}
                <select 
                  value={filter.emotion}
                  onChange={(e) => setFilter(prev => ({ ...prev, emotion: e.target.value }))}
                  className="bg-white/10 p-2 rounded-lg border border-white/20"
                >
                  <option value="">Emotion</option>
                  <option value="Regret">Regret</option>
                  <option value="Contemplative">Contemplative</option>
                </select>

                {/* Location Filter */}
                <select 
                  value={filter.location}
                  onChange={(e) => setFilter(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-white/10 p-2 rounded-lg border border-white/20"
                >
                  <option value="">Location</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>

                {/* Anonymity Filter */}
                <select 
                  value={filter.anonymity}
                  onChange={(e) => setFilter(prev => ({ ...prev, anonymity: e.target.value }))}
                  className="bg-white/10 p-2 rounded-lg border border-white/20"
                >
                  <option value="">Anonymity</option>
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Confession List */}
          <AnimatePresence>
            {filteredConfessionsList.map((confession) => (
              <motion.div
                key={confession.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 p-4 rounded-lg mb-4 border border-white/10"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-accent-orange" />
                    <span className="text-sm text-white/70">{confession.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEye className="text-white/50" />
                    <span className="text-sm text-white/70">{confession.anonymity}</span>
                  </div>
                </div>
                <p className="italic text-white/80 mb-2">"{confession.content}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-accent-orange">{confession.emotion}</span>
                  <button className="text-white/70 hover:text-white transition-colors">
                    <FaHeart />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredConfessionsList.length === 0 && (
            <div className="text-center text-white/50 py-10">
              No confessions match your filters.
            </div>
          )}
        </div>

        {/* Analytics */}
        <div className="bg-white/10 p-6 overflow-y-auto">
          <EmotionAnalytics confessions={confessions} />
          <LanguageInsights confessions={confessions} />
          <CommunityStats confessions={confessions} />
          <EmotionalWave confessions={confessions} />
        </div>
      </div>
    </div>
  );
};

export default ConfessionsPage;
