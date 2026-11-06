import React from 'react';
import { cn } from '@/lib/utils';

export const BentoGrid: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard: React.FC<{
  className?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
}> = ({ className, header, icon, title, description, children }) => {
  return (
    <div
      className={cn(
        'group relative col-span-1 rounded-2xl border border-white/[0.08] bg-[#0c1017] p-6 hover:border-white/[0.14] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl shadow-black/40',
        className
      )}
    >
      {/* Top subtle highlight reflection line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {header && <div className="mb-4">{header}</div>}

      <div className="flex-1">
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/[0.08] flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
            {icon}
          </div>
        )}
        {title && (
          <div className="font-bold text-base text-white tracking-tight mb-1">{title}</div>
        )}
        {description && (
          <div className="text-xs text-slate-400 leading-relaxed mb-4">{description}</div>
        )}
        {children}
      </div>
    </div>
  );
};
