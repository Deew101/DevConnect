import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types/database.types';

/**
 * Resolves canonical OAuth callback URL based on environment:
 * - Production GitHub Pages: https://deew101.github.io/DevConnect/auth/callback
 * - Localhost dev server: http://localhost:5173/DevConnect/auth/callback (or http://localhost:5173/auth/callback)
 */
export function getOAuthRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // 1. Production on GitHub Pages
    if (hostname.includes('github.io')) {
      return 'https://deew101.github.io/DevConnect/auth/callback';
    }

    // 2. Local development on localhost / 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const port = window.location.port || '3000';
      // If opened under /DevConnect/ locally, preserve that base
      if (pathname.startsWith('/DevConnect')) {
        return `http://localhost:${port}/DevConnect/auth/callback`;
      }
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      return `http://localhost:${port}${base}/auth/callback`;
    }

    // 3. Dynamic resolution fallback for custom hosts
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    return `${origin}${base}/auth/callback`;
  }

  return 'https://deew101.github.io/DevConnect/auth/callback';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInAsDemoGitHubUser: (demoUsername?: string) => Promise<Profile>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null; data?: Profile }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Fetch or ensure profile in public.profiles table
  const fetchOrCreateProfile = useCallback(async (supabaseUser: User): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
      }

      if (data) {
        // If GitHub metadata exists on user but profile is missing github_username or avatar, backfill it
        const rawMeta = supabaseUser.user_metadata || {};
        const githubUser = rawMeta.user_name || rawMeta.preferred_username;
        if (githubUser && (!data.github_username || !data.avatar_url)) {
          const updates: Partial<Profile> = {};
          if (!data.github_username) updates.github_username = githubUser;
          if (!data.avatar_url && rawMeta.avatar_url) updates.avatar_url = rawMeta.avatar_url;

          supabase
            .from('profiles')
            .update(updates)
            .eq('id', supabaseUser.id)
            .select()
            .single()
            .then(({ data: updated }) => {
              if (updated) setProfile(updated as Profile);
            });
        }

        setProfile(data as Profile);
        return data as Profile;
      }

      // If no profile exists yet (e.g. database trigger didn't run or first OAuth signin), create one
      const rawMeta = supabaseUser.user_metadata || {};
      const fullName = rawMeta.full_name || rawMeta.name || supabaseUser.email?.split('@')[0] || 'Developer';
      const baseUsername = (rawMeta.user_name || rawMeta.preferred_username || supabaseUser.email?.split('@')[0] || 'dev')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');
      const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
      const githubUsername = rawMeta.user_name || rawMeta.preferred_username || null;

      const newProfile: Partial<Profile> = {
        id: supabaseUser.id,
        username: uniqueUsername,
        full_name: fullName,
        avatar_url: rawMeta.avatar_url || rawMeta.picture || null,
        github_username: githubUsername,
        headline: githubUsername ? `Software Engineer (@${githubUsername})` : 'Software Developer',
        bio: 'Building awesome software and open-source projects on DevConnect.',
        experience_level: 'Mid-Level',
        availability_status: 'open_to_collaborate',
        weekly_hours_available: 10,
        interests: ['Web Development', 'Open Source'],
        is_onboarded: false,
      };

      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        // If trigger inserted concurrently or row exists, re-fetch
        const { data: existingAfterError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (existingAfterError) {
          setProfile(existingAfterError as Profile);
          return existingAfterError as Profile;
        }

        console.warn('Could not auto-create profile in Supabase table:', insertError.message);
        return null;
      }

      setProfile(createdProfile as Profile);
      return createdProfile as Profile;
    } catch (err) {
      console.error('Unexpected error fetching/creating profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    if (!user) return null;
    return fetchOrCreateProfile(user);
  }, [user, fetchOrCreateProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<{ error: Error | null; data?: Profile }> => {
      if (!user) return { error: new Error('User is not authenticated') };

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data as Profile);
        return { error: null, data: data as Profile };
      } catch (err: any) {
        return { error: err };
      }
    },
    [user]
  );

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Official session retrieval from Supabase
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error retrieving initial Supabase session:', error);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await fetchOrCreateProfile(initialSession.user);
          }
        }
      } catch (err) {
        console.error('Error during auth initialization:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    }

    initAuth();

    // Listen to real auth state changes from Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchOrCreateProfile(currentSession.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    return { error: result.error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    setIsLoading(false);
    return { error: result.error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = getOAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Supabase Google OAuth initialization error:', error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    const redirectUrl = getOAuthRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        scopes: 'read:user user:email',
      },
    });

    if (error) {
      console.error('Supabase GitHub OAuth initialization error:', error);
      throw error;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  const signInAsDemoGitHubUser = async (demoUsername = 'deew101') => {
    setIsLoading(true);
    const mockUser: any = {
      id: 'd3300000-0000-4000-a000-000000000001',
      aud: 'authenticated',
      role: 'authenticated',
      email: `${demoUsername}@users.noreply.github.com`,
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        full_name: demoUsername === 'deew101' ? 'Devang (GitHub)' : demoUsername,
        user_name: demoUsername,
        preferred_username: demoUsername,
        avatar_url: `https://github.com/${demoUsername}.png`,
        is_onboarded: true,
      },
      app_metadata: {
        provider: 'github',
        providers: ['github'],
      },
    };

    const mockProfile: Profile = {
      id: mockUser.id,
      username: demoUsername.toLowerCase(),
      full_name: demoUsername === 'deew101' ? 'Devang (GitHub)' : demoUsername,
      avatar_url: `https://github.com/${demoUsername}.png`,
      github_username: demoUsername,
      headline: `Software Engineer & Open-Source Creator (@${demoUsername})`,
      bio: 'Building software on DevConnect. Verified GitHub engineer.',
      location: 'Bengaluru, India',
      website_url: `https://github.com/${demoUsername}`,
      experience_level: 'Senior',
      availability_status: 'open_to_collaborate',
      weekly_hours_available: 15,
      interests: ['React', 'TypeScript', 'Distributed Systems', 'Open Source'],
      skills: ['TypeScript', 'React', 'Node.js', 'Go', 'Tailwind CSS'],
      is_onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;

    const mockSession: any = {
      access_token: 'mock-github-session-token',
      refresh_token: 'mock-github-refresh-token',
      expires_in: 7200,
      expires_at: Math.floor(Date.now() / 1000) + 7200,
      token_type: 'bearer',
      user: mockUser,
    };

    localStorage.setItem('devconnect-auth-token', JSON.stringify(mockSession));
    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setIsLoading(false);
    return mockProfile;
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('devconnect-auth-token');
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isInitialized,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithGitHub,
        signInAsDemoGitHubUser,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
