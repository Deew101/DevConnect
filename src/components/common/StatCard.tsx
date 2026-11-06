import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'cyan' | 'purple' | 'emerald' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  color = 'cyan',
}) => {
  const colorStyles = {
    cyan: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    purple: 'text-violet-400 bg-violet-950/40 border-violet-800/40',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
  };

  return (
    <Card className="p-5 border-slate-800 bg-[#0d1527]/80 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-white mt-1.5 tracking-tight font-mono">{value}</h4>
        </div>
        <div className={cn('p-3 rounded-xl border', colorStyles[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center text-xs">
          <span
            className={cn(
              'font-semibold mr-1.5',
              trend === 'up' && 'text-emerald-400',
              trend === 'down' && 'text-rose-400',
              trend === 'neutral' && 'text-slate-400'
            )}
          >
            {change}
          </span>
          <span className="text-slate-500">vs last week</span>
        </div>
      )}
    </Card>
  );
};
