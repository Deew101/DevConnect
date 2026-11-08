import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';
import { AvailabilityStatus } from '@/types/database.types';
import { getPresetAvatar, getDeterministicGradient } from '@/components/avatar/presetAvatars';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
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
    '2xl': 'w-24 h-24 text-2xl font-bold',
    '3xl': 'w-28 h-28 text-3xl font-bold',
  };

  const statusColors: Record<AvailabilityStatus, string> = {
    available: 'bg-[#00E6A0] ring-[#100A24]',
    open_to_collaborate: 'bg-[#8B5CF6] ring-[#100A24]',
    busy: 'bg-[#FFC247] ring-[#100A24]',
    offline: 'bg-slate-500 ring-[#100A24]',
  };

  const statusSizes = {
    xs: 'w-2 h-2 bottom-0 right-0 ring-1',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 ring-2',
    md: 'w-3 h-3 bottom-0 right-0 ring-2',
    lg: 'w-3.5 h-3.5 bottom-0 right-0 ring-2',
    xl: 'w-4 h-4 bottom-0.5 right-0.5 ring-2',
    '2xl': 'w-5 h-5 bottom-1 right-1 ring-2',
    '3xl': 'w-5 h-5 bottom-0.5 right-0.5 ring-2',
  };

  const preset = React.useMemo(() => getPresetAvatar(src), [src]);
  const gradient = React.useMemo(() => getDeterministicGradient(name || alt || 'Dev'), [name, alt]);

  return (
    <div
      className={cn(
        'relative inline-flex flex-shrink-0 select-none rounded-full',
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          'w-full h-full rounded-[inherit] overflow-hidden flex items-center justify-center border border-[rgba(167,139,250,0.25)] shadow-md transition-transform'
        )}
      >
        {preset ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: preset.svg }}
          />
        ) : src && !hasError && !src.startsWith('preset:') ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center bg-gradient-to-tr text-white font-mono font-bold tracking-wider',
              gradient
            )}
          >
            <span>{getInitials(name || alt)}</span>
          </div>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-[#100A24]',
            statusColors[status],
            statusSizes[size]
          )}
          title={`Status: ${status.replace(/_/g, ' ')}`}
        />
      )}
    </div>
  );
};
