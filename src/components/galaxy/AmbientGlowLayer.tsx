import React from 'react';

/**
 * AmbientGlowLayer — Layered atmospheric vignettes & subtle celestial coordinate dust overlay
 */
export const AmbientGlowLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Deep Space Radial Vignette (Preserves text readability & high contrast) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(8, 5, 20, 0.4) 0%, rgba(8, 5, 20, 0.85) 75%, #080514 100%)',
        }}
      />

      {/* Subtle Cosmic Coordinate Dot Grid Overlay */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C4B5FD 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Corner Ambient Glow Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#D946EF]/10 to-transparent pointer-events-none" />
    </div>
  );
};
