import { useState, useEffect, useRef } from 'react';

interface TerminalTypingOptions {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: string;
  onComplete?: () => void;
}

export const useTerminalTyping = ({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  cursor = '_',
  onComplete
}: TerminalTypingOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentIndex];
    
    if (isTyping) {
      // Typing phase
      if (displayText.length < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typeSpeed + Math.random() * 50); // Add slight randomness for realism
      } else {
        // Finished typing, pause then start deleting
        setIsTyping(false);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Finished deleting, move to next text
        setIsTyping(true);
        if (currentIndex < texts.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (loop) {
          setCurrentIndex(0);
        } else {
          onComplete?.();
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentIndex, isTyping, texts, typeSpeed, deleteSpeed, pauseDuration, loop, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const displayWithCursor = `${displayText}${showCursor ? cursor : ' '}`;
  
  return {
    displayText: displayWithCursor,
    isTyping,
    currentIndex
  };
};