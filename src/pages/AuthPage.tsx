import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, ArrowRight, Github, ShieldCheck } from 'lucide-react';
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
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  const [isRegister, setIsRegister] = useState(searchParams.get('tab') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // Detect and forward OAuth code or report provider error if landed on /auth
  React.useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error_description') || searchParams.get('error');

    if (code) {
      navigate(`/auth/callback${window.location.search}`, { replace: true });
    } else if (errorParam) {
      toast({
        title: 'Authentication Provider Notice',
        description: decodeURIComponent(errorParam).replace(/\+/g, ' '),
        type: 'error',
      });
    }
  }, [searchParams, navigate, toast]);

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
      const msg = err.message || '';
      let friendlyDesc = msg;
      if (msg.includes('provider is not enabled') || msg.includes('validation_failed')) {
        friendlyDesc = 'Google OAuth provider is not yet enabled in your Supabase project. Please enable Google in Supabase Dashboard -> Authentication -> Providers.';
      }
      toast({
        title: 'Google OAuth Initiation Notice',
        description: friendlyDesc,
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
      const msg = err.message || '';
      let friendlyDesc = msg;
      if (msg.includes('provider is not enabled') || msg.includes('validation_failed')) {
        friendlyDesc = 'GitHub OAuth provider is not yet enabled in your Supabase project. Please enable GitHub in Supabase Dashboard -> Authentication -> Providers.';
      }
      toast({
        title: 'GitHub OAuth Initiation Notice',
        description: friendlyDesc,
        type: 'error',
      });
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080514] flex flex-col justify-center items-center p-4 sm:p-6 text-[#F8F7FF] relative overflow-hidden font-sans">
      <GridPattern className="opacity-15" />
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#A855F7]/10 to-[#D946EF]/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#A855F7] to-[#D946EF] items-center justify-center shadow-lg shadow-[#8B5CF6]/30 mb-3 border border-white/10">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold mb-1">
            DEVELOPER ACCESS GATEWAY
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F8F7FF] tracking-tight">DevConnect</h1>
          <p className="text-xs text-[#B8ACD9] mt-1 font-sans">
            GitHub + LinkedIn + Discord ecosystem for engineers
          </p>
        </div>

        {/* Card */}
        <Card className="border-[rgba(167,139,250,0.25)] bg-[#160E30]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-xl rounded-2xl">
          {/* Tab selector */}
          <div className="grid grid-cols-2 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] p-1 mb-6 text-xs font-semibold font-mono">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 rounded-lg transition-all duration-200 ${
                !isRegister
                  ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] shadow-sm border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 rounded-lg transition-all duration-200 ${
                isRegister
                  ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] shadow-sm border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF]'
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
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 text-xs font-semibold text-[#F8F7FF] transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
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
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 text-xs font-semibold text-[#F8F7FF] transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <Github className="h-4 w-4" />
              <span>{oauthLoading === 'github' ? 'Redirecting...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[rgba(167,139,250,0.20)] w-full" />
            <span className="bg-[#160E30] px-3 text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider">
              Or with email credentials
            </span>
            <div className="border-t border-[rgba(167,139,250,0.20)] w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-[#B8ACD9] mb-1.5 font-mono">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Guido van Rossum"
                  icon={<User className="h-4 w-4 text-[#B8ACD9]" />}
                  className="h-10 text-xs bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] focus:border-[#8B5CF6]"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#B8ACD9] mb-1.5 font-mono">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                icon={<Mail className="h-4 w-4 text-[#B8ACD9]" />}
                className="h-10 text-xs bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] focus:border-[#8B5CF6]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B8ACD9] mb-1.5 font-mono">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={<Lock className="h-4 w-4 text-[#B8ACD9]" />}
                className="h-10 text-xs bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] focus:border-[#8B5CF6]"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 font-semibold text-xs mt-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white shadow-md shadow-[#8B5CF6]/30"
              isLoading={loading}
            >
              {isRegister ? 'Create Developer Account' : 'Sign In to DevConnect'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[rgba(167,139,250,0.20)] flex items-center justify-center gap-1.5 text-[11px] text-[#B8ACD9] font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
            <span>Supabase PostgreSQL Row Level Security (RLS)</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
