import { useEffect, useState } from "react";

const SpotlightCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9999] mix-blend-soft-light"
      style={{
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0) 180px)`,
        transition: "all 100ms ease-out",
      }}
    />
  );
};

export default SpotlightCursor;
