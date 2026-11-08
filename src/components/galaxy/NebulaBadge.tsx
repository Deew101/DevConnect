import React from 'react';
import { cn } from '@/lib/utils';

interface NebulaBadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'violet' | 'magenta' | 'lavender';
  className?: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const NebulaBadge: React.FC<NebulaBadgeProps> = ({
  children,
  variant = 'purple',
  className,
  icon,
  pulse = false,
}) => {
  const variantStyles = {
    purple: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    violet: 'bg-[#A855F7]/15 text-[#F8F7FF] border-[#A855F7]/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
    magenta: 'bg-[#D946EF]/15 text-[#F8F7FF] border-[#D946EF]/30 shadow-[0_0_12px_rgba(217,70,239,0.15)]',
    lavender: 'bg-[#C4B5FD]/10 text-[#C4B5FD] border-[#C4B5FD]/25',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wide border transition-all duration-200',
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
