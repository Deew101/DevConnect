import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-medium transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080514] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] rounded-xl text-xs sm:text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF] font-semibold shadow-md shadow-[#8B5CF6]/25 border border-[#8B5CF6]/40',
        primary:
          'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF] font-semibold shadow-md shadow-[#8B5CF6]/25 border border-[#8B5CF6]/40',
        secondary:
          'bg-[#100A24] hover:bg-[#160E30] text-[#F8F7FF] border border-[rgba(167,139,250,0.20)] shadow-sm',
        outline:
          'border border-[rgba(167,139,250,0.20)] bg-transparent hover:bg-[#160E30] text-[#F8F7FF] hover:border-[#8B5CF6]/40',
        ghost:
          'bg-transparent hover:bg-[#160E30] text-[#B8ACD9] hover:text-[#F8F7FF]',
        destructive:
          'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30',
        glow:
          'bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] hover:opacity-95 text-[#F8F7FF] font-semibold shadow-lg shadow-[#8B5CF6]/25 border border-[#8B5CF6]/30',
        link: 'text-[#A855F7] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-3.5',
        xs: 'h-6 px-2 text-xs',
        sm: 'h-7 px-3 text-xs',
        md: 'h-9 px-4 text-xs font-semibold',
        lg: 'h-11 px-6 text-sm',
        icon: 'h-8 w-8 p-0',
        'icon-xs': 'h-6 w-6 p-0',
        'icon-sm': 'h-7 w-7 p-0',
        'icon-lg': 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
