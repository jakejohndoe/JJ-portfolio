import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  glitchIntensity?: number;
  holographicEffect?: boolean;
  animateOnHover?: boolean;
}

const HolographicText = ({ 
  children, 
  className = "",
  glitchIntensity = 0.1,
  holographicEffect = true,
  animateOnHover = false
}: HolographicTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isGlitching) return;

    const glitchInterval = setInterval(() => {
      setGlitchOffset({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 2
      });
    }, 50);

    const stopGlitch = setTimeout(() => {
      setIsGlitching(false);
      setGlitchOffset({ x: 0, y: 0 });
    }, 200);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(stopGlitch);
    };
  }, [isGlitching]);

  useEffect(() => {
    const triggerRandomGlitch = () => {
      if (Math.random() < glitchIntensity) {
        setIsGlitching(true);
      }
    };

    const interval = setInterval(triggerRandomGlitch, 3000);
    return () => clearInterval(interval);
  }, [glitchIntensity]);

  const handleMouseEnter = () => {
    if (animateOnHover) {
      setIsGlitching(true);
    }
  };

  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: isGlitching ? `translate(${glitchOffset.x}px, ${glitchOffset.y}px)` : 'none'
      }}
    >
      {/* Main text */}
      <motion.div
        className="relative z-10"
        style={{
          background: holographicEffect 
            ? 'linear-gradient(45deg, #ff5e3a, #00ff41, #ff5e3a, #64ffda, #ff5e3a)'
            : 'transparent',
          backgroundSize: '400% 400%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: holographicEffect ? 'transparent' : 'inherit',
          animation: holographicEffect ? 'holographic 3s ease-in-out infinite' : 'none',
          filter: isGlitching ? 'hue-rotate(90deg) saturate(1.5)' : 'none',
          textShadow: isGlitching 
            ? '2px 0 #ff5e3a, -2px 0 #00ff41, 0 2px #64ffda'
            : holographicEffect 
              ? '0 0 10px rgba(255, 94, 58, 0.5), 0 0 20px rgba(255, 94, 58, 0.3), 0 0 30px rgba(255, 94, 58, 0.1)'
              : 'none'
        }}
      >
        {children}
      </motion.div>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-70"
            style={{
              color: '#ff5e3a',
              transform: 'translate(-2px, 0)',
              mixBlendMode: 'multiply'
            }}
          >
            {children}
          </div>
          <div
            className="absolute inset-0 z-0 opacity-70"
            style={{
              color: '#00ff41',
              transform: 'translate(2px, 0)',
              mixBlendMode: 'multiply'
            }}
          >
            {children}
          </div>
        </>
      )}

      {/* Scan line effect */}
      {holographicEffect && (
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 48%, rgba(255, 94, 58, 0.8) 50%, transparent 52%)',
            backgroundSize: '100px 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </motion.div>
  );
};

export default HolographicText;