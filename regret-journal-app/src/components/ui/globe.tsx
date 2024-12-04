import React, { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { 
  Vector3, 
  Color, 
  LineBasicMaterial, 
  BufferGeometry, 
  Line,
  Raycaster,
  Vector2,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Object3D,
  Sprite,
  SpriteMaterial
} from "three";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import { gsap } from "gsap";
import { io } from "socket.io-client";
import countries from "../../data/globe.json";

// Extend THREE namespace to include ThreeGlobe
extend({ ThreeGlobe });

// Server-side IP Geolocation Fallback
const fetchServerLocation = async (): Promise<{ latitude: number, longitude: number }> => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    console.log(`Attempting to fetch location from: ${apiBaseUrl}/locate`);
    
    const response = await fetch(`${apiBaseUrl}/locate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000  // 5-second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Server location response:', data);
    
    return {
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Server location fetch failed:', error);
    
    // Completely random fallback
    const fallbackLocation = {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180
    };
    
    console.warn('Using fallback random location:', fallbackLocation);
    return fallbackLocation;
  }
};

// Geolocation Utility with Enhanced Accuracy
const getGeolocation = (): Promise<{ latitude: number, longitude: number }> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Round to 4 decimal places for privacy and performance
          const location = {
            latitude: Number(latitude.toFixed(4)),
            longitude: Number(longitude.toFixed(4))
          };
          
          console.log('Browser geolocation:', location);
          resolve(location);
        },
        (error) => {
          console.warn(`Geolocation error (${error.code}): ${error.message}`);
          
          // Fallback to server-side IP geolocation
          fetchServerLocation()
            .then(resolve)
            .catch(() => {
              // Completely random fallback
              const fallbackLocation = {
                latitude: Math.random() * 180 - 90,
                longitude: Math.random() * 360 - 180
              };
              
              console.warn('Using final random fallback location:', fallbackLocation);
              resolve(fallbackLocation);
            });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // No geolocation support
      console.warn('Geolocation not supported, using server fallback');
      fetchServerLocation()
        .then(resolve)
        .catch(() => {
          const fallbackLocation = {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180
          };
          
          console.warn('Using final random fallback location:', fallbackLocation);
          resolve(fallbackLocation);
        });
    }
  });
};

// Convert Lat/Lon to 3D Coordinates on Sphere
const convertToSphericalCoordinates = (lat: number, lon: number, radius: number = 200) => {
  // Convert latitude and longitude to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  // Spherical to Cartesian conversion
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Confession Beam Component with Enhanced Rendering
const ConfessionBeam = ({ 
  startLat, 
  startLon, 
  endLat, 
  endLon, 
  text, 
  color = "#FF7F50" 
}: { 
  startLat: number, 
  startLon: number, 
  endLat: number, 
  endLon: number, 
  text: string, 
  color?: string 
}) => {
  const beamRef = useRef<Line>(null);
  const { camera, raycaster, gl } = useThree();

  // Create beam geometry with precise spherical coordinates
  const beamGeometry = useMemo(() => {
    const startPoint = convertToSphericalCoordinates(startLat, startLon);
    const endPoint = convertToSphericalCoordinates(endLat, endLon, 250);
    
    const geometry = new BufferGeometry().setFromPoints([startPoint, endPoint]);
    return geometry;
  }, [startLat, startLon, endLat, endLon]);

  // Beam material with dynamic color and opacity
  const beamMaterial = useMemo(() => 
    new LineBasicMaterial({
      color: new Color(color),
      transparent: true,
      opacity: 0.7,
      linewidth: 2
    }), 
  [color]);

  // Beam animation with GSAP
  useEffect(() => {
    if (!beamRef.current) return;

    const timeline = gsap.timeline();
    timeline
      .fromTo(beamRef.current.scale, 
        { x: 0, y: 0, z: 0 }, 
        { 
          x: 1, 
          y: 1, 
          z: 1, 
          duration: 1.5, 
          ease: "power2.out" 
        }
      )
      .to(beamRef.current.material, {
        opacity: 0,
        duration: 1,
        delay: 8,
        ease: "power2.in"
      });

    return () => {
      timeline.kill();
    };
  }, [beamRef]);

  return (
    <line 
      ref={beamRef}
      geometry={beamGeometry}
      material={beamMaterial}
    />
  );
};

// Globe Visualization Component
const GlobeVisualization = () => {
  const globeRef = useRef<ThreeGlobe>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!globeRef.current) return;

    // Configure globe with country data and enhanced rendering
    globeRef.current
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#ffffff")
      .atmosphereAltitude(0.1)
      .hexPolygonColor(() => "rgba(255,255,255,0.7)");

    return () => {
      if (globeRef.current) {
        scene.remove(globeRef.current);
      }
    };
  }, [globeRef, scene]);

  return (
    <threeGlobe 
      ref={globeRef} 
      position={[0, 0, 0]} 
    />
  );
};

// Main Globe Component with Socket.io Integration
export const Globe = forwardRef(({
  globeConfig,
  data = []
}: {
  globeConfig?: any;
  data?: any[];
}, ref) => {
  const [confessions, setConfessions] = useState<any[]>([]);
  const socketRef = useRef<any>(null);

  // Establish Socket.io Connection
  useEffect(() => {
    // Connect to Socket.io server
    const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:5000';
    console.log(`Connecting to Socket.io server at: ${socketServerUrl}`);
    
    socketRef.current = io(socketServerUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000
    });

    // Listen for connection errors
    socketRef.current.on('connect_error', (error) => {
      console.error(`Socket.io connection error: ${error.message}`);
    });

    // Listen for initial confessions
    socketRef.current.on('initialConfessions', (initialConfessions: any[]) => {
      console.log(`Received ${initialConfessions.length} initial confessions`);
      setConfessions(initialConfessions);
    });

    // Listen for new confessions in real-time
    socketRef.current.on('newConfession', (confession: any) => {
      console.log('New confession received');
      setConfessions(prev => {
        // Limit to 50 active confessions, remove old ones
        const updatedConfessions = [...prev, confession]
          .filter(c => Date.now() - new Date(c.timestamp).getTime() < 10000)
          .slice(-50);
        return updatedConfessions;
      });
    });

    // Cleanup socket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Expose method to submit confessions
  useImperativeHandle(ref, () => ({
    addConfession: async (text: string) => {
      try {
        // Get user location
        const location = await getGeolocation();

        // Submit confession via Socket.io or HTTP
        if (socketRef.current) {
          socketRef.current.emit('submitConfession', { 
            text, 
            location 
          });
        }
      } catch (error) {
        console.error('Confession submission failed', error);
      }
    }
  }));

  return (
    <>
      <GlobeVisualization />
      {confessions.map((confession, index) => (
        <ConfessionBeam 
          key={index}
          startLat={confession.location.latitude}
          startLon={confession.location.longitude}
          endLat={confession.location.latitude + (Math.random() * 20 - 10)}
          endLon={confession.location.longitude + (Math.random() * 20 - 10)}
          text={confession.text}
          color="#FF7F50"
        />
      ))}
    </>
  );
});

// World Component with forwardRef
export const World = forwardRef(({ 
  globeConfig = {}, 
  data = []
}: { 
  globeConfig?: any; 
  data?: any[];
}, ref) => {
  return (
    <Canvas 
      camera={{ 
        position: [0, 0, 300], 
        fov: 50 
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Globe ref={ref} globeConfig={globeConfig} data={data} />
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
});
