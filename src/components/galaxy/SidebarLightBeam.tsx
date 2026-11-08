import React from 'react';

/**
 * SidebarLightBeam — Futuristic vertical cosmic light pillar & lens flare
 * Anchored directly on the vertical border between the sidebar and workspace.
 * Reproduces the luminous neon violet light flare from the reference design.
 */
export const SidebarLightBeam: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute pointer-events-none select-none z-30 overflow-visible ${className}`}
      style={{
        right: '-1px',
        top: '190px',
        transform: 'translateX(50%)',
      }}
    >
      {/* 1. Extended Vertical Neon Light Ray */}
      <div
        className="w-[2.5px] h-[360px] rounded-full mx-auto"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.3) 15%, #A855F7 50%, rgba(217, 70, 239, 0.4) 85%, transparent 100%)',
          boxShadow: '0 0 16px 2px #A855F7, 0 0 32px 6px rgba(217, 70, 239, 0.45)',
        }}
      />

      {/* 2. Central Lens Flare Starburst */}
      <div className="absolute top-[160px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Soft Radial Core Glow */}
        <div
          className="w-28 h-28 rounded-full blur-md opacity-85"
          style={{
            background:
              'radial-gradient(circle, rgba(217, 70, 239, 0.85) 0%, rgba(168, 85, 247, 0.45) 45%, transparent 75%)',
          }}
        />

        {/* Horizontal Light Ray */}
        <div
          className="absolute w-28 h-[2px] rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C4B5FD 25%, #F8F7FF 50%, #C4B5FD 75%, transparent 100%)',
            boxShadow: '0 0 12px #A855F7',
          }}
        />

        {/* Vertical Light Ray */}
        <div
          className="absolute h-24 w-[2px] rounded-full"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, #C4B5FD 25%, #F8F7FF 50%, #C4B5FD 75%, transparent 100%)',
            boxShadow: '0 0 12px #A855F7',
          }}
        />

        {/* Bright White Center Core */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#F8F7FF,0_0_24px_#A855F7]" />
      </div>
    </div>
  );
};
