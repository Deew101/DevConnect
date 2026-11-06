import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';
import { AvailabilityStatus } from '@/types/database.types';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const statusColors: Record<AvailabilityStatus, string> = {
    available: 'bg-emerald-500 ring-emerald-950',
    open_to_collaborate: 'bg-cyan-400 ring-cyan-950',
    busy: 'bg-amber-500 ring-amber-950',
    offline: 'bg-slate-500 ring-slate-900',
  };

  const statusSizes = {
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 ring-2',
    md: 'w-3 h-3 bottom-0 right-0 ring-2',
    lg: 'w-4 h-4 bottom-0.5 right-0.5 ring-2',
    xl: 'w-5 h-5 bottom-1 right-1 ring-4',
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700/80 shadow-md',
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
          <span className="font-mono text-cyan-300">{getInitials(name || alt)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-offset-0',
            statusColors[status],
            statusSizes[size]
          )}
          title={`Status: ${status.replace(/_/g, ' ')}`}
        />
      )}
    </div>
  );
};
