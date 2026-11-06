import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'cyan' | 'purple' | 'glow';
  dot?: boolean;
}

export function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-900 text-slate-200 border-white/[0.08]',
    secondary: 'bg-slate-900/60 text-slate-400 border-white/[0.06]',
    outline: 'border-white/[0.1] text-slate-300 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    destructive: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    cyan: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    purple: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    glow: 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-200 border-sky-500/30 shadow-sm shadow-sky-500/10',
  };

  const dotColors = {
    default: 'bg-slate-400',
    secondary: 'bg-slate-500',
    outline: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    destructive: 'bg-rose-400',
    cyan: 'bg-sky-400',
    purple: 'bg-indigo-400',
    glow: 'bg-sky-400 animate-pulse',
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
