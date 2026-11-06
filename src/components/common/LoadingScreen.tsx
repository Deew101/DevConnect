import React from 'react';
import { Layers } from 'lucide-react';

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Initializing DevConnect...',
}) => {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-100">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/25 animate-pulse">
          <Layers className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-cyan-500/20 blur-md -z-10 animate-ping" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-white mb-2">DevConnect</h2>
      <p className="text-sm text-slate-400 font-mono animate-pulse">{message}</p>
    </div>
  );
};
