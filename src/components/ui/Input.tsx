import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8ACD9] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-[rgba(167,139,250,0.20)] bg-[#100A24] px-3 py-2 text-xs sm:text-sm text-[#F8F7FF] placeholder:text-[#B8ACD9] shadow-inner backdrop-blur-sm transition-all file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:outline-none focus-visible:border-[#8B5CF6] focus-visible:ring-1 focus-visible:ring-[#8B5CF6] disabled:cursor-not-allowed disabled:opacity-50 font-sans',
            icon && 'pl-10',
            error && 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="mt-1 text-xs text-rose-400 font-mono">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
