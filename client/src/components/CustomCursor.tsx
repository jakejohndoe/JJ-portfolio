import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  size: number;
  id: number;
}

const SpotlightCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    // Throttle mouse move for performance
    let animationFrameId: number;
    const move = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        const newX = e.clientX;
        const newY = e.clientY;
        
        setPosition({ x: newX, y: newY });
        setIsVisible(true);
        
        // Add trail point
        setTrail(prevTrail => {
          const newTrail: TrailPoint = {
            x: newX,
            y: newY,
            opacity: 0.8,
            size: Math.random() * 4 + 2,
            id: trailIdRef.current++
          };
          
          const updatedTrail = [newTrail, ...prevTrail.slice(0, 15)];
          return updatedTrail;
        });
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseOut = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add global mouse listeners
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Add hover detection for interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .project-card, [role="button"], input, textarea, .enhanced-button');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Initial setup
    addHoverListeners();
    
    // Re-run when DOM changes (for dynamic content)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
      
      // Clean up existing listeners
      const interactiveElements = document.querySelectorAll('a, button, .project-card, [role="button"], input, textarea, .enhanced-button');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Animate trail opacity decay
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prevTrail => 
        prevTrail
          .map(point => ({ ...point, opacity: point.opacity * 0.85 }))
          .filter(point => point.opacity > 0.1)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' ? 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  return (
    <>
      {/* Advanced cursor effects - only show if motion is allowed */}
      {!prefersReducedMotion && isVisible && (
        <>
          {/* Trail particles */}
          {trail.map((point, index) => (
            <motion.div
              key={point.id}
              className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-primary"
              style={{
                width: point.size,
                height: point.size,
                opacity: point.opacity,
                filter: `blur(${index * 0.2}px)`
              }}
              animate={{
                x: point.x - point.size / 2,
                y: point.y - point.size / 2,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.01
              }}
            />
          ))}

          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 border-2 border-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: position.x - 16,
              y: position.y - 16,
              scale: isHovering ? 1.5 : 1,
              opacity: isClicking ? 0.3 : 0.6
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.3
            }}
            style={{
              width: 32,
              height: 32,
            }}
          />
          
          {/* Main cursor dot */}
          <motion.div
            className="fixed top-0 left-0 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: position.x - 4,
              y: position.y - 4,
              scale: isClicking ? 0.8 : isHovering ? 1.5 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 30,
              mass: 0.2
            }}
            style={{
              width: 8,
              height: 8,
              boxShadow: isHovering ? '0 0 20px rgba(255, 94, 58, 0.8)' : '0 0 10px rgba(255, 94, 58, 0.5)'
            }}
          />
          
          {/* Magnetic glow effect */}
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] bg-primary"
            animate={{
              x: position.x - 20,
              y: position.y - 20,
              scale: isHovering ? 1.2 : 0.8,
              opacity: isHovering ? 0.2 : 0.1
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 40
            }}
            style={{
              width: 40,
              height: 40,
              filter: 'blur(15px)'
            }}
          />
          
          {/* Code symbols when hovering interactive elements */}
          {isHovering && (
            <>
              <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] text-primary font-mono text-sm font-bold"
                animate={{
                  x: position.x + 20,
                  y: position.y - 10,
                  rotate: [0, 5, -5, 0],
                  opacity: 1
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {"</>"}
              </motion.div>
              
              {/* Binary particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="fixed top-0 left-0 pointer-events-none z-[9998] text-primary font-mono text-xs opacity-60"
                  animate={{
                    x: position.x + (i - 1) * 25 + Math.sin(Date.now() * 0.003 + i) * 10,
                    y: position.y - 20 + Math.cos(Date.now() * 0.003 + i) * 10,
                    opacity: [0.6, 0.2, 0.6]
                  }}
                  transition={{
                    opacity: {
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    },
                    x: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    },
                    y: {
                      type: "spring", 
                      stiffness: 300,
                      damping: 30
                    }
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}
            </>
          )}
          
          {/* Click ripple effect */}
          {isClicking && (
            <motion.div
              className="fixed top-0 left-0 border-2 border-primary rounded-full pointer-events-none z-[9997]"
              initial={{
                scale: 0,
                opacity: 0.8,
                x: position.x - 25,
                y: position.y - 25
              }}
              animate={{
                scale: 3,
                opacity: 0
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
              style={{
                width: 50,
                height: 50
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default SpotlightCursor;
