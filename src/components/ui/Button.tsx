import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-xl';

    const variants = {
      primary:
        'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-md shadow-sky-500/20 border border-sky-400/40 hover:shadow-sky-500/30',
      secondary:
        'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-white/[0.08] hover:border-white/[0.14] shadow-sm',
      outline:
        'border border-white/[0.08] bg-transparent hover:bg-white/[0.04] text-slate-200 hover:text-white hover:border-white/[0.15]',
      ghost:
        'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white',
      destructive:
        'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 hover:border-rose-500/40',
      glow:
        'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold shadow-lg shadow-sky-500/25 border border-sky-400/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-xs font-semibold',
      lg: 'h-11 px-6 text-sm',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
