import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
  glow?: boolean;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className,
  spotlightColor = 'rgba(139, 92, 246, 0.16)',
  glow = false,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 hover:border-[#8B5CF6]/50 hover:-translate-y-1',
        glow && 'hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)]',
        className
      )}
      {...props}
    >
      {/* Radial Spotlight Follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      {/* Top subtle highlight reflection line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
