import React, { useEffect, useRef } from 'react';

const CursorGradientBackground = () => {
  const gradientRef = useRef(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to the viewport
      const { clientX, clientY } = e;
      
      // Update CSS variables for gradient position
      gradient.style.setProperty('--mouse-x', `${clientX}px`);
      gradient.style.setProperty('--mouse-y', `${clientY}px`);
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={gradientRef}
      className="fixed inset-0 pointer-events-none z-[-1] cursor-gradient-background"
    />
  );
};

export default CursorGradientBackground;
