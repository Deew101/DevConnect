import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';
import { AvailabilityStatus } from '@/types/database.types';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: AvailabilityStatus;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  name = '',
  size = 'md',
  status,
  className,
}) => {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-semibold',
    lg: 'w-12 h-12 text-sm font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusColors: Record<AvailabilityStatus, string> = {
    available: 'bg-emerald-400 ring-[#07090e]',
    open_to_collaborate: 'bg-sky-400 ring-[#07090e]',
    busy: 'bg-amber-400 ring-[#07090e]',
    offline: 'bg-slate-500 ring-[#07090e]',
  };

  const statusSizes = {
    xs: 'w-2 h-2 bottom-0 right-0 ring-1',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 ring-2',
    md: 'w-3 h-3 bottom-0 right-0 ring-2',
    lg: 'w-3.5 h-3.5 bottom-0 right-0 ring-2',
    xl: 'w-4 h-4 bottom-0.5 right-0.5 ring-2',
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/[0.1] shadow-md',
          sizeClasses[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-mono text-sky-300 font-semibold">{getInitials(name || alt)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute rounded-full',
            statusColors[status],
            statusSizes[size]
          )}
          title={`Status: ${status.replace(/_/g, ' ')}`}
        />
      )}
    </div>
  );
};
