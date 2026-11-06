import React from 'react';
import { Layers } from 'lucide-react';
import { GridPattern } from '@/components/ui/GridPattern';

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Initializing DevConnect...',
}) => {
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-100 relative overflow-hidden">
      <GridPattern className="opacity-25" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/25 border border-cyan-400/30">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <div className="absolute -inset-1.5 rounded-2xl bg-cyan-500/20 blur-md -z-10 animate-pulse" />
        </div>

        <h2 className="text-xl font-extrabold tracking-tight text-white mb-1.5">DevConnect</h2>
        <p className="text-xs text-slate-400 font-mono animate-pulse">{message}</p>
      </div>
    </div>
  );
};
