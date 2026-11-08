import React from 'react';

/**
 * CelestialPlanet — Photorealistic glowing cosmic celestial planet & companion satellite moon
 * Pinned at top-right space between hero title and dossier readiness card.
 * Exact replication of the celestial sphere in the Galaxy Flow reference design.
 */
export const CelestialPlanet: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-visible ${className}`}
      style={{
        top: '15px',
        right: '22%',
        width: '380px',
        height: '380px',
      }}
    >
      {/* 1. Atmospheric Violet/Magenta Cosmic Gas Halo */}
      <div
        className="absolute inset-0 rounded-full blur-[70px] opacity-75 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.55) 0%, rgba(217, 70, 239, 0.35) 40%, rgba(139, 92, 246, 0.15) 65%, transparent 80%)',
          transform: 'scale(1.4)',
        }}
      />

      {/* 2. Primary Celestial Planet Sphere (220px) */}
      <div
        className="absolute top-[20px] left-[50px] w-[220px] h-[220px] rounded-full overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.45)]"
        style={{
          background: '#0B061A',
        }}
      >
        {/* Subtle Planetary Surface Texture (Lunar Basins & Maria) */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 28%, rgba(216, 180, 254, 0.35) 0%, transparent 22%),
              radial-gradient(circle at 45% 42%, rgba(192, 132, 252, 0.3) 0%, transparent 18%),
              radial-gradient(circle at 55% 20%, rgba(233, 213, 255, 0.25) 0%, transparent 14%),
              radial-gradient(circle at 25% 65%, rgba(168, 85, 247, 0.25) 0%, transparent 25%),
              radial-gradient(circle at 45% 70%, rgba(147, 51, 234, 0.2) 0%, transparent 20%),
              radial-gradient(circle at 65% 35%, rgba(168, 85, 247, 0.18) 0%, transparent 28%),
              radial-gradient(circle at 60% 60%, rgba(126, 34, 206, 0.22) 0%, transparent 32%)
            `,
          }}
        />

        {/* Crescent Shading: Lit from top-left, deep shadow on bottom-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 32% 32%, rgba(248, 247, 255, 0.5) 0%, rgba(196, 181, 253, 0.3) 25%, rgba(168, 85, 247, 0.15) 50%, rgba(16, 10, 36, 0.9) 70%, #080514 90%)',
          }}
        />

        {/* Sharp Luminous Crescent Rim Light (Upper-Left Arc) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              'inset 12px 12px 24px -2px rgba(248, 247, 255, 0.9), inset 24px 24px 44px -4px rgba(168, 85, 247, 0.95), inset 42px 42px 64px -8px rgba(139, 92, 246, 0.8)',
          }}
        />
      </div>

      {/* Atmospheric Rim Glow Corona Overlay */}
      <div
        className="absolute top-[16px] left-[46px] w-[228px] h-[228px] rounded-full pointer-events-none"
        style={{
          boxShadow:
            '-4px -4px 32px 6px rgba(168, 85, 247, 0.6), -8px -8px 64px 12px rgba(217, 70, 239, 0.35)',
        }}
      />

      {/* 3. Companion Satellite Moon (~46px) positioned lower and to the left */}
      <div
        className="absolute top-[180px] left-[10px] w-[46px] h-[46px] rounded-full overflow-hidden shadow-[0_0_24px_rgba(168,85,247,0.4)]"
        style={{
          background: '#0B061A',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 32% 32%, rgba(248, 247, 255, 0.45) 0%, rgba(196, 181, 253, 0.25) 30%, rgba(16, 10, 36, 0.92) 70%, #080514 92%)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              'inset 5px 5px 12px -1px rgba(248, 247, 255, 0.85), inset 9px 9px 20px -2px rgba(168, 85, 247, 0.85)',
          }}
        />
      </div>

      {/* 4. Cosmic Lens Flare Starburst */}
      <div className="absolute top-[130px] left-[35px] w-6 h-6 flex items-center justify-center pointer-events-none">
        <div className="absolute w-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#F8F7FF] to-transparent shadow-[0_0_8px_#A855F7]" />
        <div className="absolute h-8 w-[1.5px] bg-gradient-to-b from-transparent via-[#F8F7FF] to-transparent shadow-[0_0_8px_#A855F7]" />
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#D946EF]" />
      </div>

      {/* 5. Second Sparkling Star */}
      <div className="absolute top-[40px] left-[15px] w-4 h-4 flex items-center justify-center pointer-events-none opacity-85">
        <div className="absolute w-5 h-[1px] bg-gradient-to-r from-transparent via-[#C4B5FD] to-transparent" />
        <div className="absolute h-5 w-[1px] bg-gradient-to-b from-transparent via-[#C4B5FD] to-transparent" />
        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#C4B5FD]" />
      </div>
    </div>
  );
};
