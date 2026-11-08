import React from 'react';

/**
 * CosmicWaveLayer — Smooth flowing purple and violet energy ribbons & abstract cosmic waves
 */
export const CosmicWaveLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
      <svg
        className="w-full h-full object-cover min-w-[1200px]"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cosmicRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D946EF" stopOpacity="0.20" />
          </linearGradient>

          <linearGradient id="cosmicRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.15" />
          </linearGradient>

          <filter id="cosmicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="24" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Cosmic Energy Ribbon */}
        <path
          d="M -100 450 C 300 280, 600 620, 1000 380 C 1250 230, 1400 480, 1600 420"
          stroke="url(#cosmicRibbon1)"
          strokeWidth="60"
          strokeLinecap="round"
          filter="url(#cosmicGlow)"
          opacity="0.6"
        />

        {/* Secondary Harmonizing Flow */}
        <path
          d="M -150 580 C 250 680, 750 320, 1100 520 C 1350 660, 1500 390, 1650 490"
          stroke="url(#cosmicRibbon2)"
          strokeWidth="36"
          strokeLinecap="round"
          filter="url(#cosmicGlow)"
          opacity="0.4"
        />

        {/* Thin High-Frequency Celestial Wave */}
        <path
          d="M -50 320 Q 350 180 720 340 T 1500 260"
          stroke="#C4B5FD"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
