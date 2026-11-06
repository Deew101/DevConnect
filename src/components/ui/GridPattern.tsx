import React from 'react';
import { cn } from '@/lib/utils';

export const GridPattern: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className, width = 32, height = 32 }) => {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full stroke-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
        className
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern-def"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern-def)" />
    </svg>
  );
};
