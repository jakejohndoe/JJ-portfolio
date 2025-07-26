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
      {/* Clean cursor dot - only show if motion is allowed */}
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