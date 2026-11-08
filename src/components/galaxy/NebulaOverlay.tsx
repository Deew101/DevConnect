import React from 'react';

/**
 * NebulaOverlay — Layered volumetric nebula cloud formations
 * Complements the 4K base image with vibrant deep violet, electric purple,
 * neon magenta, soft lavender, and subtle pink glowing gas streams.
 */
export const NebulaOverlay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Electric Purple & Violet Diagonal Cosmic Core */}
      <div
        className="absolute top-[10%] left-[20%] w-[900px] h-[550px] -rotate-12 rounded-full blur-[110px] opacity-45 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 45% 50%, #A855F7 0%, #8B5CF6 35%, #6D28D9 65%, transparent 85%)',
        }}
      />

      {/* 2. Radiant Neon Magenta / Pink Gas Cluster */}
      <div
        className="absolute top-[28%] right-[15%] w-[800px] h-[500px] rotate-6 rounded-full blur-[100px] opacity-40 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, #D946EF 0%, #C026D3 35%, #9333EA 60%, transparent 80%)',
        }}
      />

      {/* 3. Soft Lavender Celestial Light Diffusion (Center Horizon) */}
      <div
        className="absolute top-[18%] left-[40%] w-[600px] h-[400px] rounded-full blur-[90px] opacity-35 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #E9D5FF 0%, #C4B5FD 30%, #8B5CF6 60%, transparent 75%)',
        }}
      />

      {/* 4. Deep Violet Ambient Gas (Sidebar & Left Region) */}
      <div
        className="absolute -top-[5%] -left-[10%] w-[750px] h-[750px] rounded-full blur-[130px] opacity-35 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, #7C3AED 0%, #5B21B6 45%, #3B0764 70%, transparent 85%)',
        }}
      />

      {/* 5. Lower Space Magenta & Indigo Cloud (Bottom-Right) */}
      <div
        className="absolute -bottom-[10%] right-[5%] w-[850px] h-[600px] rounded-full blur-[120px] opacity-35 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 55% 50%, #C026D3 0%, #7E22CE 40%, #1E1035 70%, transparent 85%)',
        }}
      />
    </div>
  );
};
