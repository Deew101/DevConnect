import React from 'react';
import { BaseCosmicImage } from './BaseCosmicImage';
import { NebulaOverlay } from './NebulaOverlay';
import { CosmicEnergyWaves } from './CosmicEnergyWaves';
import { StarfieldOverlay } from './StarfieldOverlay';
import { CosmicDustOverlay } from './CosmicDustOverlay';
import { AmbientLighting } from './AmbientLighting';
import { SubtleAnimatedParticles } from './SubtleAnimatedParticles';

export interface GalaxyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * GalaxyBackground — Master Cinematic Galaxy Flow Environment
 *
 * Layered Architecture:
 * 1. BaseCosmicImage: 4K high-resolution deep-space nebula landscape foundation
 * 2. NebulaOverlay: Volumetric purple, violet, magenta, and lavender gas cloud depth
 * 3. CosmicEnergyWaves: Luminous flowing plasma ribbons weaving diagonally through space
 * 4. StarfieldOverlay: Multi-depth twinkling stellar field with diffraction spikes
 * 5. CosmicDustOverlay: Subtle astronomical coordinate grid & micro-stardust texture
 * 6. AmbientLighting: Deep-space contrast vignettes ensuring WCAG AAA text legibility
 * 7. SubtleAnimatedParticles: Gentle drifting luminous plasma motes
 */
export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative min-h-screen w-full bg-[#05020F] text-[#F8F7FF] selection:bg-[#8B5CF6]/30 selection:text-[#F8F7FF] ${className}`}
    >
      {/* Fixed Cinematic Cosmic Environment Stack (Z-Index 0, covers full viewport behind scrolling content) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <BaseCosmicImage />
        <NebulaOverlay />
        <CosmicEnergyWaves />
        <StarfieldOverlay />
        <CosmicDustOverlay />
        <AmbientLighting />
        <SubtleAnimatedParticles />
      </div>

      {/* Foreground Interface Stack (Z-Index 10) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
    </div>
  );
};

export {
  BaseCosmicImage,
  NebulaOverlay,
  CosmicEnergyWaves,
  StarfieldOverlay,
  CosmicDustOverlay,
  AmbientLighting,
  SubtleAnimatedParticles,
};
