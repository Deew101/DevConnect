import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="h-16 w-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
        <Layers className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2 font-mono">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The route you are looking for does not exist on DevConnect or may have been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
