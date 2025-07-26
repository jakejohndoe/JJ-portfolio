import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SpotlightCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Throttle mouse move for performance
    let animationFrameId: number;
    const move = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseOut = () => setIsVisible(false);

    // Add global mouse move listener
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", handleMouseOut);
    
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
      observer.disconnect();
      
      // Clean up existing listeners
      const interactiveElements = document.querySelectorAll('a, button, .project-card, [role="button"], input, textarea, .enhanced-button');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' ? 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  return (
    <>
      {/* Original spotlight effect */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9998] mix-blend-soft-light"
        style={{
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0) 180px)`,
          transition: "all 100ms ease-out",
        }}
      />
      
      {/* Enhanced cursor elements - only show if motion is allowed */}
      {!prefersReducedMotion && isVisible && (
        <>
          {/* Main cursor dot */}
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: position.x - 6,
              y: position.y - 6,
              scale: isHovering ? 1.8 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              mass: 0.5
            }}
          />
          
          {/* Trailing ring */}
          <motion.div
            className="fixed top-0 left-0 w-6 h-6 border border-primary/40 rounded-full pointer-events-none z-[9997]"
            animate={{
              x: position.x - 12,
              y: position.y - 12,
              scale: isHovering ? 2.5 : 1,
              opacity: isHovering ? 0.8 : 0.4
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.8,
              opacity: { duration: 0.2 }
            }}
          />
          
          {/* Code symbol when hovering interactive elements */}
          {isHovering && (
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9999] text-primary font-mono text-xs font-bold"
              animate={{
                x: position.x + 16,
                y: position.y - 8,
                opacity: 1
              }}
              initial={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              {"</>"}
            </motion.div>
          )}
        </>
      )}
    </>
  );
};

export default SpotlightCursor;
