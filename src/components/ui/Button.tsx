import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-medium transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#648BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090C13] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] rounded-xl text-xs sm:text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-[#648BFF] hover:bg-[#5277E6] text-white font-semibold shadow-md shadow-[#648BFF]/25 border border-[#648BFF]/40',
        primary:
          'bg-[#648BFF] hover:bg-[#5277E6] text-white font-semibold shadow-md shadow-[#648BFF]/25 border border-[#648BFF]/40',
        secondary:
          'bg-[#141C2B] hover:bg-[#192338] text-[#F1F5FC] border border-[#273249] shadow-sm',
        outline:
          'border border-[#273249] bg-transparent hover:bg-[#141C2B] text-[#F1F5FC] hover:border-[#648BFF]/40',
        ghost:
          'bg-transparent hover:bg-[#141C2B] text-[#929DB2] hover:text-[#F1F5FC]',
        destructive:
          'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30',
        glow:
          'bg-gradient-to-r from-[#648BFF] via-[#7B82FF] to-[#9B7BFF] hover:opacity-95 text-white font-semibold shadow-lg shadow-[#648BFF]/25 border border-[#648BFF]/30',
        link: 'text-[#648BFF] underline-offset-4 hover:underline',
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
  ({ className, variant = 'default', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <ButtonPrimitive
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-current" />}
        {children}
      </ButtonPrimitive>
    );
  }
);
Button.displayName = 'Button';
