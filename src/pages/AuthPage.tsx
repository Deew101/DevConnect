import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, ArrowRight, Github, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { GridPattern } from '@/components/ui/GridPattern';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub, isConfigured } = useAuth();
  const { toast } = useToast();

  const [isRegister, setIsRegister] = useState(searchParams.get('tab') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (isRegister && !fullName.trim()) {
      toast({ title: 'Full name is required to register', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) throw error;
        toast({
          title: 'Account created!',
          description: 'Please check your email if confirmation is enabled, or proceed to onboarding.',
          type: 'success',
        });
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        toast({ title: 'Welcome back!', type: 'success' });
      }

      navigate('/dashboard');
    } catch (err: any) {
      toast({
        title: isRegister ? 'Registration failed' : 'Sign in failed',
        description: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setOauthLoading('google');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast({
        title: 'Google OAuth failed',
        description: err.message,
        type: 'error',
      });
      setOauthLoading(null);
    }
  };

  const handleGitHubAuth = async () => {
    setOauthLoading('github');
    try {
      await signInWithGitHub();
    } catch (err: any) {
      toast({
        title: 'GitHub OAuth failed',
        description: err.message,
        type: 'error',
      });
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      <GridPattern className="opacity-25" />
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 items-center justify-center shadow-lg shadow-cyan-500/20 mb-3 border border-cyan-400/30">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">DevConnect</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            GitHub + LinkedIn + Discord ecosystem for engineers
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-800/80 bg-[#0c1017]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab selector */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-900 border border-slate-800 p-1 mb-6 text-xs font-semibold font-mono">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 rounded-lg transition-all ${
                !isRegister
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 rounded-lg transition-all ${
                isRegister
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              disabled={Boolean(oauthLoading)}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800/90 text-xs font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{oauthLoading === 'google' ? 'Redirecting...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              disabled={Boolean(oauthLoading)}
              onClick={handleGitHubAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800/90 text-xs font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <Github className="h-4 w-4" />
              <span>{oauthLoading === 'github' ? 'Redirecting...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0c1017] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Or with email credentials
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Guido van Rossum"
                  icon={<User className="h-4 w-4" />}
                  className="h-10 text-xs"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                icon={<Mail className="h-4 w-4" />}
                className="h-10 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={<Lock className="h-4 w-4" />}
                className="h-10 text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 font-semibold text-xs mt-3 shadow-md shadow-cyan-500/20"
              isLoading={loading}
            >
              {isRegister ? 'Create Developer Account' : 'Sign In to DevConnect'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Supabase PostgreSQL Row Level Security (RLS)</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
