import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { cn } from "@/lib/utils";

interface Confession {
  text: string;
  lat: number;
  lon: number;
  color?: string;
}

interface GlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  confessions?: Confession[];
}

export function Globe({ 
  className, 
  confessions = [
    { text: "I regret not pursuing my passion", lat: 40.7128, lon: -74.0060, color: '#FF6B6B' },
    { text: "Wish I had spent more time with family", lat: 51.5074, lon: -0.1278, color: '#4ECDC4' },
    { text: "Missed opportunities haunt me", lat: 35.6762, lon: 139.6503, color: '#45B7D1' },
  ],
  ...props 
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeConfession, setActiveConfession] = useState<{
    confession: Confession, 
    position: THREE.Vector3,
    screenPosition?: { x: number, y: number }
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true 
    });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create globe with realistic texture
    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load('/earth-texture.jpg');
    const normalMap = textureLoader.load('/earth-normal-map.jpg');

    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const material = new THREE.MeshStandardMaterial({ 
      map: globeTexture,
      normalMap: normalMap,
      roughness: 0.7,
      metalness: 0.3,
      color: 0xffffff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.1
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Atmospheric glow effect with subtle neon touch
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x0088ff) },
        opacity: { value: 0.2 }
      },
      vertexShader: `
        varying vec3 vertexNormal;
        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float opacity;
        varying vec3 vertexNormal;
        void main() {
          float intensity = pow(0.7 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(glowColor, opacity * intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 128, 128),
      atmosphereMaterial
    );
    scene.add(atmosphereMesh);

    // Add confession markers
    const markerGroup = new THREE.Group();
    const markerPositions: {confession: Confession, position: THREE.Vector3, marker: THREE.Mesh}[] = [];

    confessions.forEach(confession => {
      // Convert lat/lon to 3D coordinates
      const phi = (90 - confession.lat) * (Math.PI / 180);
      const theta = (confession.lon + 180) * (Math.PI / 180);
      
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 32, 32),
        new THREE.MeshStandardMaterial({ 
          color: confession.color || '#FF6B6B',
          emissive: confession.color || '#FF6B6B',
          emissiveIntensity: 2
        })
      );
      
      // Position marker on globe surface
      const markerPosition = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * 1.01,
        Math.cos(phi) * 1.01,
        Math.sin(phi) * Math.sin(theta) * 1.01
      );
      
      marker.position.copy(markerPosition);
      
      // Add interaction
      marker.userData = confession;
      markerGroup.add(marker);

      markerPositions.push({
        confession,
        position: markerPosition,
        marker: marker
      });
    });
    scene.add(markerGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 2.5;

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Projection helper to convert 3D to 2D
    const projectToScreen = (position: THREE.Vector3) => {
      const vector = position.clone().project(camera);
      const halfWidth = renderer.domElement.width / 2;
      const halfHeight = renderer.domElement.height / 2;
      
      return {
        x: (vector.x * halfWidth) + halfWidth,
        y: -(vector.y * halfHeight) + halfHeight
      };
    };

    // Automatically activate nearest marker
    let lastTime = 0;
    const activateNearestMarker = (time: number) => {
      if (time - lastTime > 3000) { // Every 3 seconds
        lastTime = time;
        
        // Find marker closest to camera
        let closestMarker = markerPositions[0];
        let minDistance = markerPositions[0].position.distanceTo(camera.position);
        
        markerPositions.forEach(markerData => {
          const distance = markerData.position.distanceTo(camera.position);
          if (distance < minDistance) {
            minDistance = distance;
            closestMarker = markerData;
          }
        });

        // Calculate screen position for the marker
        const screenPos = projectToScreen(closestMarker.position);

        setActiveConfession({
          confession: closestMarker.confession,
          position: closestMarker.position,
          screenPosition: screenPos
        });
      }
    };

    // Animation loop
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      controls.update();
      activateNearestMarker(time);
      renderer.render(scene, camera);
    };
    animate(0);

    // Resize handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [confessions]);

  return (
    <div 
      {...props} 
      className={cn(
        "relative h-full w-full max-w-[600px] aspect-square", 
        className
      )}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
      />
      {activeConfession && activeConfession.screenPosition && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${activeConfession.screenPosition.x}px`,
            top: `${activeConfession.screenPosition.y}px`,
          }}
        >
          {/* Pointer line */}
          <div 
            className="absolute w-16 h-0.5 bg-white/70 transform -translate-x-full -translate-y-1/2"
            style={{
              transformOrigin: 'right center',
              animation: 'pointerGrow 0.3s ease-out'
            }}
          />
          
          {/* Confession bubble */}
          <div 
            className="relative ml-4 bg-black/70 text-white p-3 rounded-lg 
                       max-w-xs text-center shadow-lg"
            style={{
              animationName: 'confessionPopIn',
              animationDuration: '0.3s',
              animationTimingFunction: 'ease-out'
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
        @keyframes pointerGrow {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
