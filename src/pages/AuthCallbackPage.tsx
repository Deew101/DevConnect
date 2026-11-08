import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Lock,
  Terminal,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GridPattern } from '@/components/ui/GridPattern';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();

  const [status, setStatus] = useState<'exchanging' | 'success' | 'error'>('exchanging');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const hasExchangedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate PKCE exchange in React StrictMode
    if (hasExchangedRef.current) return;
    hasExchangedRef.current = true;

    async function processOAuthCallback() {
      try {
        // 1. Check for provider error parameters
        const urlError = searchParams.get('error') || searchParams.get('error_code');
        const errorDesc = searchParams.get('error_description') || searchParams.get('msg');

        if (urlError || errorDesc) {
          console.error('OAuth redirect returned provider error:', { urlError, errorDesc });
          setStatus('error');
          setErrorMessage(
            errorDesc
              ? decodeURIComponent(errorDesc).replace(/\+/g, ' ')
              : `OAuth provider authentication failed (${urlError}).`
          );
          return;
        }

        // 2. Check if a valid session already exists
        setCurrentStep(2);
        const { data: existingSessionData } = await supabase.auth.getSession();
        if (existingSessionData?.session) {
          setCurrentStep(3);
          const p = await refreshProfile();
          setStatus('success');
          setTimeout(() => {
            if (p && !p.is_onboarded) {
              navigate('/onboarding', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }, 600);
          return;
        }

        // 3. Extract PKCE Authorization Code
        const code = searchParams.get('code');

        if (code) {
          setCurrentStep(2);
          // Explicitly exchange authorization code for Supabase session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            // Check if concurrent detectSessionInUrl or onAuthStateChange already succeeded
            const { data: retrySession } = await supabase.auth.getSession();
            if (retrySession?.session) {
              setCurrentStep(3);
              const p = await refreshProfile();
              setStatus('success');
              setTimeout(() => {
                if (p && !p.is_onboarded) {
                  navigate('/onboarding', { replace: true });
                } else {
                  navigate('/dashboard', { replace: true });
                }
              }, 600);
              return;
            }

            console.error('PKCE authorization code exchange error:', exchangeError);
            throw exchangeError;
          }

          setCurrentStep(3);
          if (data.session) {
            const p = await refreshProfile();
            setStatus('success');
            setTimeout(() => {
              if (p && !p.is_onboarded) {
                navigate('/onboarding', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }, 600);
            return;
          }
        }

        // 4. Handle implicit flow hash fragment fallback (e.g. #access_token=...)
        if (window.location.hash.includes('access_token')) {
          setCurrentStep(2);
          const { data: hashSessionData, error: hashError } = await supabase.auth.getSession();
          if (hashError) throw hashError;

          if (hashSessionData?.session) {
            setCurrentStep(3);
            const p = await refreshProfile();
            setStatus('success');
            setTimeout(() => {
              if (p && !p.is_onboarded) {
                navigate('/onboarding', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }, 600);
            return;
          }
        }

        // 5. Final fallback check
        const { data: finalSessionCheck } = await supabase.auth.getSession();
        if (finalSessionCheck?.session) {
          setStatus('success');
          navigate('/dashboard', { replace: true });
        } else {
          // No credentials found, return to sign in
          setStatus('error');
          setErrorMessage('No authorization code or active session found in callback URL.');
        }
      } catch (err: any) {
        console.error('OAuth callback processing error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Failed to complete OAuth authentication session exchange.');
      }
    }

    processOAuthCallback();
  }, [searchParams, navigate, refreshProfile]);

  return (
    <div className="min-h-screen bg-[#080514] flex flex-col justify-center items-center p-4 sm:p-6 text-[#F8F7FF] relative overflow-hidden font-sans">
      <GridPattern className="opacity-15" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-[#8B5CF6]/15 to-[#D946EF]/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] items-center justify-center shadow-lg shadow-[#8B5CF6]/25 mb-3 border border-[rgba(167,139,250,0.30)]">
            <Layers className="h-6 w-6 text-[#F8F7FF]" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-[#A855F7] uppercase font-semibold mb-1">
            AUTHENTICATION EXCHANGE
          </div>
          <h1 className="text-2xl font-display font-extrabold text-[#F8F7FF] tracking-tight">
            DevConnect Session Gateway
          </h1>
        </div>

        <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl rounded-2xl">
          {status === 'exchanging' && (
            <div className="space-y-6 text-center">
              <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[rgba(167,139,250,0.20)]" />
                <div className="absolute inset-0 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin" />
                <Lock className="w-5 h-5 text-[#A855F7]" />
              </div>

              <div>
                <h2 className="text-lg font-bold font-display text-[#F8F7FF]">
                  Authorizing OAuth Identity
                </h2>
                <p className="text-xs text-[#B8ACD9] mt-1 leading-relaxed">
                  Exchanging authorization credentials with Supabase PKCE service...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-2 text-left bg-[#100A24] p-3.5 rounded-xl border border-[rgba(167,139,250,0.20)] font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[#F8F7FF]">1. OAuth Provider Callback Captured</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentStep >= 2 ? 'bg-[#8B5CF6] animate-pulse' : 'bg-[#B8ACD9]/40'
                    }`}
                  />
                  <span className={currentStep >= 2 ? 'text-[#C4B5FD]' : 'text-[#B8ACD9]'}>
                    2. Cryptographic Token Exchange
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentStep >= 3 ? 'bg-emerald-400' : 'bg-[#B8ACD9]/40'
                    }`}
                  />
                  <span className={currentStep >= 3 ? 'text-[#F8F7FF]' : 'text-[#B8ACD9]'}>
                    3. Launching Developer Dashboard
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold font-display text-[#F8F7FF]">
                  Authentication Successful
                </h2>
                <p className="text-xs text-[#B8ACD9] mt-1">
                  Session established. Redirecting to your developer workspace...
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full h-10 text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF]"
                  onClick={() => navigate('/dashboard')}
                >
                  Enter DevConnect Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5 text-center py-1">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold font-display text-[#F8F7FF]">
                  Authentication Failed
                </h2>
                <div className="mt-2 p-3 rounded-xl bg-[#100A24] border border-rose-500/30 text-xs text-rose-300 font-mono text-left break-words">
                  {errorMessage || 'An error occurred during authentication exchange.'}
                </div>
              </div>

              <div className="p-3.5 bg-[#100A24] rounded-xl border border-[rgba(167,139,250,0.20)] text-left text-[11px] text-[#B8ACD9] space-y-1">
                <div className="font-mono text-[#A855F7] font-bold text-[10px] uppercase">
                  SUPABASE CONFIGURATION AUDIT
                </div>
                <div>• Verify Google OAuth provider is toggled <strong>Enabled</strong> in Supabase.</div>
                <div>• Verify Authorized Redirect URI in Google Cloud Console matches Supabase:</div>
                <div className="font-mono text-[10px] text-[#F8F7FF] bg-[#160E30] p-2 rounded-lg border border-[rgba(167,139,250,0.20)] select-all break-all">
                  https://ngzzgocnoimbayynstz.supabase.co/auth/v1/callback
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <Link to="/auth" className="flex-1">
                  <Button
                    variant="primary"
                    className="w-full h-10 text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF]"
                  >
                    Return to Sign In
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="h-10 text-xs font-semibold border-[rgba(167,139,250,0.20)] text-[#F8F7FF] hover:bg-[#160E30]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
