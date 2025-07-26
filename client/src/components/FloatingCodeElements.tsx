import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CodeElement {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotationSpeed: number;
  floatSpeed: number;
}

const FloatingCodeElements = () => {
  const [elements, setElements] = useState<CodeElement[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const codeSnippets = [
    'const', 'function', '=>', '{}', '[]', '()', 'async', 'await',
    'React', 'useState', 'useEffect', 'TypeScript', 'interface',
    'class', 'extends', 'import', 'export', 'default',
    '===', '!==', '&&', '||', '...', '?.', 'null', 'undefined',
    '<>', '/>', '<div>', '</div>', 'npm', 'git', 'commit', 'push',
    'API', 'HTTP', 'JSON', 'CSS', 'HTML', 'JS', 'TS', 'JSX'
  ];

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);
    
    const handleChange = () => setIsVisible(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const generateElements = () => {
      const newElements: CodeElement[] = [];
      const elementCount = 25;

      for (let i = 0; i < elementCount; i++) {
        newElements.push({
          id: i,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 12,
          opacity: Math.random() * 0.3 + 0.1,
          rotationSpeed: Math.random() * 360 + 180,
          floatSpeed: Math.random() * 20 + 10
        });
      }
      
      setElements(newElements);
    };

    generateElements();

    // Regenerate elements periodically
    const interval = setInterval(() => {
      generateElements();
    }, 30000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={`${element.id}-${element.text}`}
          className="absolute font-mono font-bold select-none"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            color: '#ff5e3a',
            opacity: element.opacity,
            textShadow: '0 0 10px rgba(255, 94, 58, 0.3)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            y: [0, -element.floatSpeed, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.rotationSpeed / 60,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.5,
            opacity: element.opacity * 2,
            textShadow: '0 0 20px rgba(255, 94, 58, 0.8)',
            transition: { duration: 0.3 }
          }}
        >
          {element.text}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCodeElements;