import React from 'react';

/**
 * NebulaLayer — Atmospheric flowing cosmic nebula clouds
 * Built with layered radial and conic atmospheric gradients in deep purple,
 * electric violet, neon magenta and soft lavender.
 */
export const NebulaLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Primary Deep Violet Nebula (Top-Left / Center Drift) */}
      <div
        className="absolute -top-[20%] left-[10%] w-[750px] h-[750px] rounded-full blur-[160px] opacity-30 animate-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #8B5CF6 0%, #6D28D9 45%, rgba(139, 92, 246, 0) 75%)',
          animationDuration: '14s',
        }}
      />

      {/* 2. Electric Violet Core Cloud (Center-Right Drift) */}
      <div
        className="absolute top-[30%] -right-[15%] w-[650px] h-[650px] rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #A855F7 0%, #7C3AED 40%, rgba(168, 85, 247, 0) 70%)',
        }}
      />

      {/* 3. Neon Magenta Energy Burst (Bottom-Left Atmospheric Glow) */}
      <div
        className="absolute -bottom-[15%] left-[15%] w-[700px] h-[700px] rounded-full blur-[170px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 45% 55%, #D946EF 0%, #9333EA 50%, rgba(217, 70, 239, 0) 75%)',
        }}
      />

      {/* 4. Soft Lavender Celestial Haze (Upper Center Subtle Highlight) */}
      <div
        className="absolute top-[10%] left-[45%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #C4B5FD 0%, #8B5CF6 30%, transparent 65%)',
        }}
      />

      {/* 5. Deep Space Indigo Void (Lower Right Horizon) */}
      <div
        className="absolute bottom-[5%] right-[5%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #1E1035 0%, #100A24 60%, transparent 80%)',
        }}
      />
    </div>
  );
};
