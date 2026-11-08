import React from 'react';

/**
 * AmbientLighting — Atmospheric deep-space depth & contrast vignettes
 * Ensures excellent legibility for foreground text, charts, and dark glassmorphic cards
 * while allowing rich cosmic nebulae and stars to shine through naturally.
 */
export const AmbientLighting: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Deep Space Radial Vignette (Preserves text readability & contrast across dashboard) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(5, 2, 15, 0.25) 0%, rgba(8, 5, 20, 0.65) 60%, rgba(5, 2, 15, 0.92) 100%)',
        }}
      />

      {/* 2. Top Header & Nav Contrast Guard */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(8, 5, 20, 0.65) 0%, transparent 100%)',
        }}
      />

      {/* 3. Left Sidebar Contrast Guard */}
      <div
        className="absolute top-0 bottom-0 left-0 w-80 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(8, 5, 20, 0.6) 0%, transparent 100%)',
        }}
      />

      {/* 4. Subtle Cosmic Ambient Accent Glows (Corners) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/12 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-gradient-to-tl from-[#D946EF]/12 to-transparent pointer-events-none blur-3xl" />
    </div>
  );
};
