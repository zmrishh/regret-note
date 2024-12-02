import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function SimpleGlobe() {
  useEffect(() => {
    console.log('SimpleGlobe component mounted');
    return () => console.log('SimpleGlobe component unmounted');
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={0x2c3e50} />
      </mesh>

      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function ConfessionGlobeWrapper() {
  useEffect(() => {
    console.log('ConfessionGlobeWrapper component mounted');
    return () => console.log('ConfessionGlobeWrapper component unmounted');
  }, []);

  return (
    <div className="relative w-full h-[80vh] bg-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="animate-pulse">Loading Globe...</div>
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 2.5], fov: 45 }}
          style={{ width: '100%', height: '100%', background: 'black' }}
          onCreated={(state) => {
            console.log('Canvas created', state);
          }}
        >
          <SimpleGlobe />
        </Canvas>
      </Suspense>
    </div>
  );
}
