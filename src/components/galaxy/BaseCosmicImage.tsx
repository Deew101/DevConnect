import React, { useState } from 'react';

/**
 * BaseCosmicImage — High-resolution 4K cinematic cosmic galaxy foundation
 * Renders the high-fidelity deep-space nebula asset with flowing plasma energy,
 * dense starfield, and subtle distant celestial objects.
 */
export const BaseCosmicImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const imageSrc = `${cleanBase}assets/images/galaxy-flow-bg.jpg`;

  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Deep space base color to prevent any flash before image load */}
      <div className="absolute inset-0 bg-[#05020F]" />

      {/* 2. High-Resolution 4K Cosmic Landscape Asset */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover object-center fixed inset-0 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-90' : 'opacity-0'
        }`}
        style={{
          filter: 'contrast(1.08) saturate(1.15) brightness(0.92)',
          transform: 'scale(1.02)',
        }}
      />

      {/* 3. Deep space atmospheric color-blend overlay to harmonize with theme */}
      <div
        className="absolute inset-0 mix-blend-color-dodge opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #8B5CF6 0%, #A855F7 35%, transparent 75%)',
        }}
      />
    </div>
  );
};
