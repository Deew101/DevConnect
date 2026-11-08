import React from 'react';
import { NebulaLayer } from './NebulaLayer';
import { StarParticleLayer } from './StarParticleLayer';
import { CosmicWaveLayer } from './CosmicWaveLayer';
import { AmbientGlowLayer } from './AmbientGlowLayer';

export interface GalaxyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * GalaxyBackground — Master Galaxy Flow visual environment
 * Modular structure:
 * - AmbientGlowLayer (atmospheric depth & contrast vignettes)
 * - NebulaLayer (rich purple, violet, magenta atmospheric gas clouds)
 * - CosmicWaveLayer (flowing purple & violet energy ribbons)
 * - StarParticleLayer (twinkling celestial stars)
 */
export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#080514] text-[#F8F7FF] selection:bg-[#8B5CF6]/30 selection:text-[#F8F7FF] ${className}`}>
      {/* Fixed Cosmic Environment Stack (Z-Index 0) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <NebulaLayer />
        <CosmicWaveLayer />
        <StarParticleLayer />
        <AmbientGlowLayer />
      </div>

      {/* Foreground Interface Stack (Z-Index 10) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
    </div>
  );
};

export { NebulaLayer, StarParticleLayer, CosmicWaveLayer, AmbientGlowLayer };
