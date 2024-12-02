import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const StickyNote = ({ 
  text, 
  color = '#FFD700', 
  rotation = 0, 
  className = '',
  onInteract 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [textLines, setTextLines] = useState([]);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D Tilt Effect
  const rotateX = useTransform(mouseY, [0, 250], [-10, 10]);
  const rotateY = useTransform(mouseX, [0, 250], [10, -10]);

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    }
  };

  // More advanced text wrapping with emotional context
  const wrapText = (text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = [];

    words.forEach(word => {
      const testLine = [...currentLine, word].join(' ');
      
      // More sophisticated wrapping
      if (testLine.length > 25) {
        lines.push(currentLine.join(' '));
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    return lines;
  };

  // Enhanced line decoration with emotional nuance
  const decorateLines = (lines) => {
    const emotionalVariations = [
      { color: '#333', weight: 500 },     // Neutral
      { color: '#555', weight: 400 },     // Slightly subdued
      { color: '#444', weight: 600 },     // Slightly emphasized
    ];

    return lines.map((line, index) => ({
      text: line,
      indent: Math.random() * 12 - 6,     // Random indent between -6 and 6 pixels
      rotation: Math.random() * 1.2 - 0.6, // Slight rotation
      opacity: 0.9 - (index * 0.1),        // Decreasing opacity
      ...emotionalVariations[index % emotionalVariations.length]
    }));
  };

  useEffect(() => {
    const wrappedLines = wrapText(text, 250);
    setTextLines(decorateLines(wrappedLines));
  }, [text]);

  // Color variations based on emotion
  const getEmotionalColor = (baseColor) => {
    const colorVariations = {
      '#FFD700': {
        hover: '#FFC107',
        shadow: 'rgba(255,215,0,0.2)'
      },
      '#FFA500': {
        hover: '#FF8C00',
        shadow: 'rgba(255,165,0,0.2)'
      }
    };

    return colorVariations[baseColor] || {
      hover: baseColor,
      shadow: 'rgba(0,0,0,0.1)'
    };
  };

  const emotionalColors = getEmotionalColor(color);

  return (
    <motion.div
      ref={containerRef}
      className={`sticky-note-container ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'top left',
      }}
      onMouseMove={handleMouseMove}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        y: 20 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
        rotateX,
        rotateY
      }}
      whileHover={{ 
        scale: 1.05,
        rotate: rotation + (rotation > 0 ? -2 : 2),
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => {
        setIsHovered(true);
        onInteract && onInteract('hover');
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onInteract && onInteract('unhover');
      }}
      onClick={() => onInteract && onInteract('click')}
    >
      <div 
        className="sticky-note"
        style={{ 
          backgroundColor: isHovered ? emotionalColors.hover : color,
          boxShadow: `
            0 14px 28px ${emotionalColors.shadow}, 
            0 10px 10px ${emotionalColors.shadow}
          `
        }}
      >
        <div className="sticky-note-tape"></div>
        <div className="sticky-note-content">
          {textLines.map((line, index) => (
            <motion.p 
              key={index} 
              className="text-line"
              style={{
                paddingLeft: `${line.indent}px`,
                transform: `rotate(${line.rotation}deg)`,
                opacity: line.opacity,
                color: line.color,
                fontWeight: line.weight,
                textAlign: index % 2 === 0 ? 'left' : 'right'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: line.opacity, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>
        <div 
          className={`sticky-note-corner ${isHovered ? 'hovered' : ''}`}
        ></div>
      </div>
    </motion.div>
  );
};

export default StickyNote;
