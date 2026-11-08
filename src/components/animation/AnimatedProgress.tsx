import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedProgressProps {
  value: number; // 0 to 100
  height?: number;
  color?: string;
  className?: string;
  showGlow?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  height = 6,
  color = 'from-[#638DFF] to-[#9875FF]',
  className = '',
  showGlow = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={`relative w-full rounded-full bg-[#0D1320] border border-[#27334B] overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <motion.div
        initial={shouldReduceMotion ? { width: `${clamped}%` } : { width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
      >
        {showGlow && clamped > 5 && (
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 blur-[2px]" />
        )}
      </motion.div>
    </div>
  );
};
