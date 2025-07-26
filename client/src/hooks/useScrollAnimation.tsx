import { useInView } from "framer-motion";
import { useRef } from "react";

export const useScrollAnimation = (threshold = 0.1, margin = "-10%") => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    threshold, 
    margin 
  });
  
  return [ref, isInView] as const;
};

export const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Performance-optimized variants for reduced motion
export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};