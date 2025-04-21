import { useState, useEffect, useRef } from "react";

const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const countRef = useRef<number>(0);

  useEffect(() => {
    // Reset animation when target changes
    countRef.current = 0;
    setCount(0);
    startTimeRef.current = undefined;
    
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      countRef.current = Math.floor(progress * target);
      setCount(countRef.current);
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target, duration]);
  
  return count;
};

export default useCounter;
