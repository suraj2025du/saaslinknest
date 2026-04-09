'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white mb-4">Invalid Link</h2>
        <p className="text-slate-400 mb-8">This password reset link is invalid or has expired.</p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-xs hover:underline"
        >
          Request a new link
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none">
        Reset <br /> Password.
      </h1>
      <p className="text-slate-400 mb-8 font-medium">
        Enter your new password below to regain access to your account.
      </p>

      {isSuccess ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your password has been reset. Redirecting you to login...
          </p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="absolute inset-y-0 left-0 bg-emerald-500"
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-primary transition-colors" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-14 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Confirm New Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-primary transition-colors" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-14 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
              />
            </div>
          </div>

          {error && (
            <p className="text-rose-500 text-xs font-bold flex items-center gap-2 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative"
      >
        <Suspense fallback={<div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </main>
  );
}
