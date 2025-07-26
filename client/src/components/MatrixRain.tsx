import { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  intensity?: number;
  speed?: number;
  className?: string;
}

const MatrixRain = ({ intensity = 0.02, speed = 50, className = "" }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of code symbols, letters, and numbers
    const chars = [
      '0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 
      'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 
      'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 
      'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
      '{', '}', '[', ']', '(', ')', '<', '>', '=', '+', '-', '*', '/', '%', 
      '&', '|', '^', '~', '!', '?', ':', ';', '.', ',', '@', '#', '$', '_'
    ];
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Initialize drops array
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * canvas.height;
    }

    // Colors for different types of characters
    const colors = [
      'rgba(255, 94, 58, 0.8)',   // Primary orange
      'rgba(0, 255, 65, 0.6)',    // Matrix green
      'rgba(255, 255, 255, 0.4)', // White
      'rgba(100, 255, 218, 0.5)', // Cyan
    ];

    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < speed) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Black background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      // Draw the falling characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Random color with weighted preference for orange
        const colorIndex = Math.random() < 0.4 ? 0 : Math.floor(Math.random() * colors.length);
        ctx.fillStyle = colors[colorIndex];
        
        // Add glow effect for primary color
        if (colorIndex === 0) {
          ctx.shadowColor = 'rgba(255, 94, 58, 0.5)';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly or when it goes off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i] += Math.random() < intensity ? 1 : 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, speed]);

  // Respect user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);
    
    const handleChange = () => setIsVisible(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 opacity-30 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixRain;