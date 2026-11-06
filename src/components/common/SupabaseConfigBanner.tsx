import React, { useState } from 'react';
import { AlertTriangle, Key, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export const SupabaseConfigBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isSupabaseConfigured) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-600/40 px-4 py-3 text-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-300">Supabase Not Connected:</span>{' '}
            <span className="text-slate-300">
              DevConnect requires real Supabase credentials. Add your URL and Anon Key in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-200 font-mono text-xs">.env</code>.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Supabase Dashboard <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            {isExpanded ? 'Hide Instructions' : 'View Instructions'}
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <p className="font-medium text-white flex items-center gap-1.5">
            <Key className="h-4 w-4 text-amber-400" /> 3 Steps to connect your live Supabase database:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
            <li>
              Create a free project at <span className="text-white">supabase.com</span>.
            </li>
            <li>
              Go to <span className="text-white">Project Settings &gt; API</span> and copy your <strong>Project URL</strong> and <strong>anon public API Key</strong>.
            </li>
            <li>
              Paste them into the file <code className="text-cyan-300">.env</code> as <code className="text-cyan-300">VITE_SUPABASE_URL</code> and <code className="text-cyan-300">VITE_SUPABASE_ANON_KEY</code>.
            </li>
            <li>
              Execute the SQL migration in <code className="text-cyan-300">supabase/migrations/20261106000001_initial_schema.sql</code> inside your Supabase SQL Editor.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
