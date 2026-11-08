import React from 'react';

/**
 * BaseCosmicImage — High-resolution 4K cinematic cosmic galaxy foundation
 * Renders the high-fidelity deep-space nebula asset with flowing plasma energy,
 * dense starfield, and subtle distant celestial objects.
 */
export const BaseCosmicImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const imageSrc = `${cleanBase}assets/images/galaxy-flow-bg.jpg`;

  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(5, 2, 15, 0.42), rgba(8, 4, 20, 0.72)), url("${imageSrc}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'contrast(1.08) saturate(1.15) brightness(0.95)',
      }}
    >
      {/* Deep space atmospheric color-blend overlay to harmonize with theme */}
      <div
        className="absolute inset-0 mix-blend-color-dodge opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #8B5CF6 0%, #A855F7 35%, transparent 75%)',
        }}
      />
    </div>
  );
};
