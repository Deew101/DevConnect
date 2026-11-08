import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'cyan' | 'purple' | 'glow';
  dot?: boolean;
}

export function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#160E30] text-[#F8F7FF] border-[rgba(167,139,250,0.20)]',
    secondary: 'bg-[#100A24] text-[#B8ACD9] border-[rgba(167,139,250,0.15)]',
    outline: 'border-[rgba(167,139,250,0.25)] text-[#C4B5FD] bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    destructive: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    cyan: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30',
    purple: 'bg-[#A855F7]/15 text-[#F8F7FF] border-[#A855F7]/30',
    glow: 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#D946EF]/25 text-[#F8F7FF] border-[#A855F7]/40 shadow-sm shadow-[#8B5CF6]/20',
  };

  const dotColors = {
    default: 'bg-[#C4B5FD]',
    secondary: 'bg-[#B8ACD9]',
    outline: 'bg-[#A855F7]',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    destructive: 'bg-rose-400',
    cyan: 'bg-[#8B5CF6]',
    purple: 'bg-[#A855F7]',
    glow: 'bg-[#D946EF] animate-pulse',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors select-none font-mono',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </div>
  );
}
