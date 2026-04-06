'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSuccess(true);
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

  return (
    <main className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative"
      >
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none">
          Forgot <br /> Password?
        </h1>
        <p className="text-slate-400 mb-8 font-medium">
          No worries! Just enter your email and we&apos;ll send you a link to reset it.
        </p>

        {isSuccess ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-brand-primary" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Check your email!</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              If an account exists with that email, you&apos;ll receive a password reset link shortly.
            </p>
            <Link 
              href="/login"
              className="block w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all shadow-xl"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
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
              className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
