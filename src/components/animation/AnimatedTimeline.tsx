import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'active' | 'upcoming';
  tag?: string;
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({ items, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative pl-6 space-y-8 ${className}`}>
      {/* Vertical Spine */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#27334B]" />

      {items.map((item, index) => {
        const isCompleted = item.status === 'completed';
        const isActive = item.status === 'active';

        return (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative"
          >
            {/* Status Node */}
            <div
              className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                isCompleted
                  ? 'border-[#31D69A] bg-[#31D69A]/20'
                  : isActive
                  ? 'border-[#638DFF] bg-[#638DFF] shadow-sm shadow-[#638DFF]/50 animate-pulse'
                  : 'border-[#27334B] bg-[#0D1320]'
              }`}
            >
              {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-[#31D69A]" />}
            </div>

            {/* Content Box */}
            <div className="p-4 rounded-xl border border-[#27334B] bg-[#131D2D] hover:border-[#638DFF]/40 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display font-bold text-sm text-[#F4F6FC]">{item.title}</span>
                {item.date && (
                  <span className="text-[10px] font-mono text-[#98A6BD] bg-[#0D1320] px-2 py-0.5 rounded border border-[#27334B]">
                    {item.date}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#98A6BD] leading-relaxed">{item.description}</p>
              {item.tag && (
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono text-[#638DFF] bg-[#638DFF]/10 border border-[#638DFF]/20 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
