import React from 'react';

/**
 * CosmicDustOverlay — Atmospheric stardust textures & celestial coordinate grain
 * Adds authentic deep-space granularity, micro-dust clusters, and subtle cosmic depth.
 */
export const CosmicDustOverlay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Fine Cosmic Coordinate Dot Matrix (Ultra-low opacity, authentic astronomical feel) */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C4B5FD 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 2. Micro Stardust Cluster (Volumetric depth) */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 15% 25%, #F8F7FF 100%, transparent),
            radial-gradient(1px 1px at 35% 65%, #C4B5FD 100%, transparent),
            radial-gradient(1.5px 1.5px at 70% 30%, #D946EF 100%, transparent),
            radial-gradient(1px 1px at 85% 75%, #A855F7 100%, transparent),
            radial-gradient(1.5px 1.5px at 50% 85%, #F8F7FF 100%, transparent),
            radial-gradient(1px 1px at 25% 90%, #C4B5FD 100%, transparent),
            radial-gradient(2px 2px at 60% 15%, #A855F7 100%, transparent),
            radial-gradient(1px 1px at 90% 45%, #F8F7FF 100%, transparent)
          `,
          backgroundSize: '380px 380px',
        }}
      />
    </div>
  );
};
