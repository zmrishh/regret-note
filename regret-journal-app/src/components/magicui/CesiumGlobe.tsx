import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Minimal Cesium configuration
Cesium.Ion.defaultAccessToken = 'your_cesium_ion_token'; // Optional: replace with your token

interface Confession {
  text: string;
  lat: number;
  lon: number;
  color?: string;
}

interface CesiumGlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  confessions?: Confession[];
}

export function CesiumGlobe({ 
  className, 
  confessions = [
    { text: "I regret not pursuing my passion", lat: 40.7128, lon: -74.0060, color: '#FF6B6B' },
    { text: "Wish I had spent more time with family", lat: 51.5074, lon: -0.1278, color: '#4ECDC4' },
    { text: "Missed opportunities haunt me", lat: 35.6762, lon: 139.6503, color: '#45B7D1' },
  ],
  ...props 
}: CesiumGlobeProps) {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const [activeConfession, setActiveConfession] = useState<{
    confession: Confession, 
    screenPosition?: { x: number, y: number }
  } | null>(null);

  useEffect(() => {
    if (!globeContainerRef.current) return;

    // Initialize Cesium Viewer with minimal configuration
    const viewer = new Cesium.Viewer(globeContainerRef.current, {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      baseLayerPicker: false,
      geocoder: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      homeButton: false,
      sceneModePicker: false
    });

    // Customize globe appearance
    const scene = viewer.scene;
    scene.globe.enableLighting = true;
    scene.backgroundColor = Cesium.Color.TRANSPARENT;

    // Create confession entities
    const confessionEntities = confessions.map(confession => {
      return viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(confession.lon, confession.lat),
        point: {
          pixelSize: 15,
          color: Cesium.Color.fromCssColorString(confession.color || '#FF6B6B'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        }
      });
    });

    // Confession reveal mechanism
    let currentIndex = 0;
    const revealConfession = () => {
      const entity = confessionEntities[currentIndex];
      
      // Fly to location
      viewer.flyTo(entity, {
        duration: 2,
        offset: new Cesium.HeadingPitchRange(0, -Math.PI / 4, 2000000)
      });

      // Calculate screen position
      const cartesian = entity.position?.getValue(Cesium.JulianDate.now());
      if (cartesian) {
        const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          scene, 
          cartesian
        );

        if (screenPos) {
          setActiveConfession({
            confession: confessions[currentIndex],
            screenPosition: { x: screenPos.x, y: screenPos.y }
          });
        }
      }

      // Cycle to next confession
      currentIndex = (currentIndex + 1) % confessions.length;
    };

    // Start confession reveal cycle
    const intervalId = setInterval(revealConfession, 5000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      viewer.destroy();
    };
  }, [confessions]);

  return (
    <div 
      {...props} 
      className={`relative w-full h-full ${className}`}
    >
      <div 
        ref={globeContainerRef} 
        className="absolute inset-0 w-full h-full"
      />
      {activeConfession && activeConfession.screenPosition && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${activeConfession.screenPosition.x}px`,
            top: `${activeConfession.screenPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="relative bg-black/70 text-white p-3 rounded-lg 
                       max-w-xs text-center shadow-lg"
            style={{
              animation: 'confessionPopIn 0.3s ease-out'
            }}
          >
            <p className="text-sm">{activeConfession.confession.text}</p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes confessionPopIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
