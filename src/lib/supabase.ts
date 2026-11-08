import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ DevConnect: Supabase credentials are missing or default in .env! Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'devconnect-auth-token',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Safely creates or retrieves a Supabase Realtime channel by removing any pre-existing
 * channel with the same topic first, completely preventing:
 * "cannot add 'postgres_changes' callbacks for realtime:... after 'subscribe()'"
 */
export function safeCreateChannel(topic: string) {
  try {
    const existing = supabase.getChannels().find(
      (c) => c.topic === `realtime:${topic}` || c.topic === topic
    );
    if (existing) {
      supabase.removeChannel(existing);
    }
  } catch (err) {
    console.warn('Error clearing existing realtime channel:', err);
  }
  return supabase.channel(topic);
}
