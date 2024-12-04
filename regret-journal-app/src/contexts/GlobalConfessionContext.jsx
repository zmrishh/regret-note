import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalConfessionContext = createContext(null);

export const GlobalConfessionProvider = ({ children }) => {
  const [globalConfessions, setGlobalConfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get user's location from IP
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        location: `${data.city}, ${data.country_name}`
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  // Add a new confession to the globe
  const addGlobalConfession = async (confessionText) => {
    try {
      const locationData = await getUserLocation();
      if (!locationData) return;

      const newConfession = {
        ...locationData,
        confession: confessionText,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };

      setGlobalConfessions(prev => [...prev, newConfession]);

      // Here you would typically also send this to your backend
      // await sendConfessionToBackend(newConfession);
    } catch (error) {
      console.error('Error adding confession:', error);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get confessions for a specific region
  const getRegionConfessions = (lat, lng, radius = 1000) => {
    return globalConfessions.filter(confession => {
      const distance = getDistanceFromLatLonInKm(
        lat, lng,
        confession.lat, confession.lng
      );
      return distance <= radius;
    });
  };

  // Calculate distance between two points
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <GlobalConfessionContext.Provider value={{
      globalConfessions,
      addGlobalConfession,
      formatTimestamp,
      getRegionConfessions,
      isLoading
    }}>
      {children}
    </GlobalConfessionContext.Provider>
  );
};

export const useGlobalConfessions = () => {
  const context = useContext(GlobalConfessionContext);
  if (!context) {
    throw new Error('useGlobalConfessions must be used within a GlobalConfessionProvider');
  }
  return context;
};

export default GlobalConfessionContext;
