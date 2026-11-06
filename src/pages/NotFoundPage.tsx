import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GridPattern } from '@/components/ui/GridPattern';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-center text-slate-100 relative overflow-hidden">
      <GridPattern className="opacity-25" />
      <div className="relative z-10 max-w-sm">
        <div className="h-16 w-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
          <Layers className="h-8 w-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-2 font-mono tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-200 mb-2">Endpoint Not Found</h2>
        <p className="text-xs text-slate-400 max-w-xs mb-6 mx-auto leading-relaxed">
          The requested route is not available on this DevConnect workspace cluster.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="md" className="font-semibold text-xs">
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
