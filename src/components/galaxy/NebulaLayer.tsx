import React from 'react';

/**
 * NebulaLayer — Atmospheric flowing cosmic nebula clouds
 * Deep cosmic palette: #080514, #100A24, #8B5CF6, #A855F7, #D946EF, #C4B5FD.
 * Matches the reference design's luminous nebula sweep behind the workspace cards.
 */
export const NebulaLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Deep Space Cosmic Violet Center-Right Sweep (behind the planet & cards) */}
      <div
        className="absolute top-[5%] right-[10%] w-[900px] h-[650px] rounded-full blur-[140px] opacity-45 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, #A855F7 0%, #7C3AED 35%, #581C87 60%, transparent 80%)',
        }}
      />

      {/* 2. Neon Magenta Energy Stream (Diagonal sweep across center) */}
      <div
        className="absolute top-[25%] left-[30%] w-[800px] h-[450px] -rotate-12 rounded-full blur-[130px] opacity-35 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 45% 50%, #D946EF 0%, #9333EA 45%, #6B21A8 70%, transparent 85%)',
        }}
      />

      {/* 3. Deep Purple Ambient Mist (Top-Left / Header & Sidebar region) */}
      <div
        className="absolute -top-[10%] left-[5%] w-[750px] h-[600px] rounded-full blur-[150px] opacity-35 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, #8B5CF6 0%, #6D28D9 45%, rgba(109, 40, 217, 0) 75%)',
        }}
      />

      {/* 4. Soft Lavender Celestial Haze (Upper Center Horizon) */}
      <div
        className="absolute top-[12%] left-[45%] w-[550px] h-[350px] rounded-full blur-[110px] opacity-25 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #C4B5FD 0%, #8B5CF6 40%, transparent 70%)',
        }}
      />

      {/* 5. Lower Left Ambient Violet Nebula */}
      <div
        className="absolute bottom-[0%] left-[10%] w-[700px] h-[500px] rounded-full blur-[160px] opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, #9333EA 0%, #6B21A8 50%, transparent 80%)',
        }}
      />

      {/* 6. Lower Right Deep Cosmic Indigo Shadow */}
      <div
        className="absolute bottom-[2%] right-[5%] w-[600px] h-[450px] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #1E1035 0%, #100A24 65%, transparent 85%)',
        }}
      />
    </div>
  );
};
