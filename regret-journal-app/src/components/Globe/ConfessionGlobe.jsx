import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

const ConfessionGlobe = () => {
  const globeEl = useRef();
  const [confessionData, setConfessionData] = useState([]);
  const [hoveredConfession, setHoveredConfession] = useState(null);

  useEffect(() => {
    // Initialize globe
    const globe = Globe()(globeEl.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointRadius(0.5)
      .pointAltitude(0.1)
      .pointColor(() => '#ff6b6b')
      .pointLabel(point => `
        <div class="bg-black/80 p-2 rounded-lg backdrop-blur-sm border border-white/20">
          <p class="text-white text-sm">${point.confession}</p>
          <p class="text-white/60 text-xs">${point.location}</p>
          <p class="text-accent-orange text-xs">${point.timestamp}</p>
        </div>
      `)
      .onPointHover(point => setHoveredConfession(point));

    // Set initial camera position
    globe.pointOfView({ altitude: 2.5 });

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Mock data - Replace this with real confession data
    const mockData = [
      {
        lat: 40.7128,
        lng: -74.0060,
        location: "New York, USA",
        confession: "i regret not taking that job offer...",
        timestamp: "2 hours ago"
      },
      {
        lat: 51.5074,
        lng: -0.1278,
        location: "London, UK",
        confession: "should've told them how i felt",
        timestamp: "5 hours ago"
      },
      // Add more mock data points
    ];

    setConfessionData(mockData);
    globe.pointsData(mockData);

    // Cleanup
    return () => {
      globe.controls().dispose();
    };
  }, []);

  // Update data points when confessionData changes
  useEffect(() => {
    if (globeEl.current) {
      Globe()(globeEl.current).pointsData(confessionData);
    }
  }, [confessionData]);

  // Function to add new confession (call this when a new confession is made)
  const addNewConfession = (confession) => {
    setConfessionData(prev => [...prev, confession]);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Globe Container */}
      <div ref={globeEl} className="w-full h-full" />

      {/* Hover Info */}
      {hoveredConfession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-4 bg-black/80 p-4 rounded-xl backdrop-blur-lg border border-white/20"
        >
          <h3 className="text-white font-bold mb-2">{hoveredConfession.location}</h3>
          <p className="text-white/80">{hoveredConfession.confession}</p>
          <p className="text-accent-orange text-sm mt-2">{hoveredConfession.timestamp}</p>
        </motion.div>
      )}

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 bg-black/80 p-4 rounded-xl backdrop-blur-lg border border-white/20">
        <h3 className="text-white font-bold mb-2">Global Confessions</h3>
        <p className="text-accent-orange text-2xl font-bold">{confessionData.length}</p>
        <p className="text-white/60 text-sm">Active Confessors</p>
      </div>
    </div>
  );
};

export default ConfessionGlobe;
