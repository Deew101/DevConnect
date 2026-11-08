import React from 'react';

/**
 * CosmicEnergyWaves — Luminous flowing purple and magenta plasma ribbons
 * Broad, organic, multi-layered diagonal energy formations sweeping across deep space.
 */
export const CosmicEnergyWaves: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full object-cover min-w-[1280px]"
        viewBox="0 0 1600 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Ribbon Gradients */}
          <linearGradient id="plasmaRibbon1" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#A855F7" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#D946EF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="plasmaRibbon2" x1="100%" y1="10%" x2="0%" y2="90%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#C4B5FD" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="plasmaRibbon3" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#E879F9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.15" />
          </linearGradient>

          {/* Deep Plasma Atmospheric Diffusion Filters */}
          <filter id="broadPlasmaGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="38" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="softPlasmaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Broad Primary Diagonal Energy Plasma Wave */}
        <path
          d="M -120 420 C 320 220, 680 640, 1150 360 C 1380 220, 1550 440, 1750 380"
          stroke="url(#plasmaRibbon1)"
          strokeWidth="110"
          strokeLinecap="round"
          filter="url(#broadPlasmaGlow)"
          opacity="0.55"
        />

        {/* 2. Overlapping Harmonizing Electric Wave */}
        <path
          d="M -150 560 C 280 660, 800 280, 1220 500 C 1460 620, 1580 340, 1780 440"
          stroke="url(#plasmaRibbon2)"
          strokeWidth="70"
          strokeLinecap="round"
          filter="url(#broadPlasmaGlow)"
          opacity="0.45"
        />

        {/* 3. High-Frequency Luminous Plasma Core Ribbon */}
        <path
          d="M -80 400 C 360 260, 720 580, 1180 340 C 1420 210, 1580 400, 1720 360"
          stroke="url(#plasmaRibbon3)"
          strokeWidth="32"
          strokeLinecap="round"
          filter="url(#softPlasmaGlow)"
          opacity="0.5"
        />

        {/* 4. Fine Sparkling Energy Threads */}
        <path
          d="M -50 340 Q 420 180 820 380 T 1650 280"
          stroke="#C4B5FD"
          strokeWidth="2"
          strokeDasharray="8 12"
          opacity="0.3"
        />

        <path
          d="M -50 590 Q 520 720 980 450 T 1680 520"
          stroke="#E879F9"
          strokeWidth="1.5"
          strokeDasharray="6 14"
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
