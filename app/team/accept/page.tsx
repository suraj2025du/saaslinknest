'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  LogIn,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

function TeamAcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [inviteData, setInviteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No invite token provided');
      setIsLoading(false);
      return;
    }

    const checkInvite = async () => {
      try {
        const res = await fetch(`/api/team/accept?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Invalid invite');
          return;
        }

        setInviteData(data);
      } catch (err) {
        setError('Failed to load invite details');
      } finally {
        setIsLoading(false);
      }
    };

    checkInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;

    setIsAccepting(true);
    setError('');

    try {
      const res = await fetch('/api/team/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to accept invite');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to accept invite');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-primary/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card-gloss p-10 rounded-[2.5rem] w-full max-w-md space-y-8 relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/30">
            <Zap className="text-white w-7 h-7 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">LinkNest</span>
        </div>

        {error ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white mb-2">Invalid Invite</h2>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Go to Login
            </button>
          </div>
        ) : success ? (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white mb-2">Welcome to the Team!</h2>
              <p className="text-slate-400 text-sm">
                You've successfully joined <strong>{inviteData?.profileName}</strong>. Redirecting to dashboard...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Team Invitation</h2>
              <p className="text-slate-400 text-sm">
                You've been invited to collaborate on <strong>{inviteData?.profileName}</strong> as an{' '}
                <span className="text-brand-primary font-black">{inviteData?.role}</span>.
              </p>
            </div>

            {!inviteData?.isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs text-amber-400 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    You need to be logged in to accept this invite.
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/login?redirect=/team/accept?token=${token}`)}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20"
                >
                  <LogIn className="w-5 h-5" />
                  Login to Accept
                </button>
              </div>
            ) : !inviteData?.isCorrectEmail ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-xs text-red-400 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    This invite was sent for a different email address.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Switch Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 font-medium">
                    Logged in as <strong className="text-white">{inviteData?.email}</strong>
                  </p>
                </div>
                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                  {isAccepting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Accept Invitation
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function TeamAcceptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full"
        />
      </div>
    }>
      <TeamAcceptContent />
    </Suspense>
  );
}
