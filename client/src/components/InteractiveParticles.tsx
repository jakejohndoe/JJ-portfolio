import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number; opacity: number }[];
}

interface InteractiveParticlesProps {
  particleCount?: number;
  maxDistance?: number;
  mouseRadius?: number;
  className?: string;
}

const InteractiveParticles = ({ 
  particleCount = 80,
  maxDistance = 150,
  mouseRadius = 100,
  className = ""
}: InteractiveParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
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
      initParticles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle colors (orange-themed)
    const colors = [
      'rgba(255, 94, 58, 0.8)',   // Primary orange
      'rgba(255, 140, 120, 0.6)', // Light orange
      'rgba(255, 160, 140, 0.4)', // Very light orange
      'rgba(255, 255, 255, 0.3)', // White
    ];

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: []
        });
      }
    };

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isMoving: true
      };

      // Reset mouse movement flag after a delay
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    initParticles();

    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < 16) { // 60 FPS
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Clear canvas with slight transparency for trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update trail
        particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity });
        if (particle.trail.length > 8) {
          particle.trail.pop();
        }

        // Mouse interaction
        if (mouse.isMoving) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            
            // Repel particles from mouse
            particle.vx -= Math.cos(angle) * force * 0.02;
            particle.vy -= Math.sin(angle) * force * 0.02;
            
            // Increase particle size and opacity when near mouse
            particle.size = Math.min(particle.size * 1.1, 8);
            particle.opacity = Math.min(particle.opacity * 1.2, 1);
          }
        }

        // Apply velocity with some friction
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Gradually return to normal size and opacity
        particle.size = Math.max(particle.size * 0.995, 1);
        particle.opacity = Math.max(particle.opacity * 0.998, 0.2);

        // Boundary bouncing
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle trail
        particle.trail.forEach((trailPoint, index) => {
          const trailOpacity = (particle.trail.length - index) / particle.trail.length;
          const trailSize = particle.size * (trailOpacity * 0.5);
          
          ctx.beginPath();
          ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(/0\.\d+\)/, `${trailOpacity * 0.3})`);
          ctx.fill();
        });

        // Draw main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (maxDistance - distance) / maxDistance * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 94, 58, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, maxDistance, mouseRadius]);

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
      className={`fixed inset-0 pointer-events-none z-[2] opacity-40 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default InteractiveParticles;