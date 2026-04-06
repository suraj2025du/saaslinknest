'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, ArrowLeft, ShieldCheck, Star, Mail, Lock, Eye, EyeOff,
  Loader2, ChevronRight, Sparkles
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animated Background                                                */
/* ------------------------------------------------------------------ */

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-surface-950" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(-45deg, #7C3AED, #EC4899, #06B6D4, #8B5CF6)',
          backgroundSize: '400% 400%',
          animation: 'gradient-xy 15s ease infinite',
        }}
      />

      {/* Floating orbs */}
      {[
        { size: 600, color: 'rgba(124,58,237,0.35)', x: '10%', y: '20%', duration: 20, delay: 0 },
        { size: 500, color: 'rgba(236,72,153,0.3)', x: '70%', y: '10%', duration: 25, delay: 2 },
        { size: 400, color: 'rgba(6,182,212,0.25)', x: '50%', y: '70%', duration: 22, delay: 4 },
        { size: 350, color: 'rgba(139,92,246,0.3)', x: '20%', y: '80%', duration: 18, delay: 1 },
        { size: 300, color: 'rgba(236,72,153,0.2)', x: '80%', y: '60%', duration: 24, delay: 3 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.size / 3}px)`,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            y: [0, -60, 20, -30, 0],
            x: [0, 40, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,15,26,0.8) 100%)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient Loading Spinner                                           */
/* ------------------------------------------------------------------ */

function GradientSpinner() {
  return (
    <div className="relative w-5 h-5" role="status" aria-label="Loading">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #7C3AED, #EC4899, #06B6D4, #7C3AED)',
          animation: 'spin-slow 1s linear infinite',
          mask: 'radial-gradient(circle, transparent 60%, black 61%)',
          WebkitMask: 'radial-gradient(circle, transparent 60%, black 61%)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Input Field                                               */
/* ------------------------------------------------------------------ */

interface AuthInputProps {
  icon: React.ElementType;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}

function AuthInput({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, rightElement }: AuthInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">{label}</label>
      <div className={`relative rounded-xl transition-all duration-300 ${focused ? 'shadow-lg shadow-brand-primary/10' : ''}`}>
        {/* Animated gradient border */}
        <div
          className={`absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-300 ${focused ? 'opacity-100' : 'group-hover:opacity-50'}`}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #EC4899, #06B6D4)',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />
        <div className="relative flex items-center bg-surface-900/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
          <div className={`pl-4 transition-colors duration-300 ${focused ? 'text-brand-primary' : 'text-slate-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent px-4 py-3.5 text-white placeholder:text-slate-600 outline-none text-sm font-medium"
            placeholder={placeholder}
            autoComplete={autoComplete}
            required
          />
          {rightElement && <div className="pr-3">{rightElement}</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Social Login Button                                                */
/* ------------------------------------------------------------------ */

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function SocialButton({ icon, label, onClick }: SocialButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full bg-surface-900/60 backdrop-blur-sm border border-white/5 hover:border-white/10 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group overflow-hidden"
    >
      {/* Hover gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))',
        }}
      />
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Login Page                                                         */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setTempToken(data.tempToken);
          setShow2FA(true);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/two-factor/login', {
        method: 'POST',
        body: JSON.stringify({ tempToken, token: twoFactorCode }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid 2FA code. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      const authWindow = window.open(url, 'google_oauth_popup', 'width=600,height=700');
      if (!authWindow) {
        alert('Please allow popups for this site to login with Google.');
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        router.push('/dashboard');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleKeyDown2FA = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && twoFactorCode.length === 6) handle2FAVerify();
  }, [twoFactorCode, handle2FAVerify]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <AnimatedBackground />

      {/* Main card */}
      <motion.div
        initial={mounted ? { opacity: 0, y: 30, scale: 0.97 } : undefined}
        animate={mounted ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glassmorphism card */}
        <div
          className="relative rounded-3xl overflow-hidden p-8 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(11,15,26,0.8) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) inset',
          }}
        >
          {/* Top gradient accent line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-32 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #7C3AED, #EC4899, transparent)',
            }}
          />

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group text-sm font-semibold"
          >
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-brand-primary transition-colors" />
            </motion.div>
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                boxShadow: '0 10px 40px rgba(124,58,237,0.35)',
              }}
            >
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              <Zap className="relative z-10 text-white w-7 h-7 fill-white" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight leading-tight mb-2">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)',
                }}
              >
                Welcome back.
              </span>
            </h1>
            <p className="text-slate-400 font-medium">Enter your details to access your dashboard.</p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2FA Verification */}
          <AnimatePresence mode="wait">
            {show2FA ? (
              <motion.div
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))',
                      border: '1px solid rgba(124,58,237,0.2)',
                    }}
                  >
                    <ShieldCheck className="w-10 h-10 text-brand-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Two-Factor Authentication</h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={handleKeyDown2FA}
                    className="w-full bg-surface-900/80 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-5 text-3xl font-bold text-white focus:outline-none transition-all placeholder:text-slate-600 text-center tracking-[0.5em]"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    placeholder="000000"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handle2FAVerify}
                  disabled={isLoading || twoFactorCode.length !== 6}
                  className="w-full font-black py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    boxShadow: '0 10px 40px rgba(124,58,237,0.3)',
                    color: '#fff',
                  }}
                >
                  {isLoading ? (
                    <>
                      <GradientSpinner />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => {
                    setShow2FA(false);
                    setTwoFactorCode('');
                    setError('');
                  }}
                  className="w-full text-slate-500 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleLogin} className="space-y-5">
                  <AuthInput
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                  <AuthInput
                    icon={Lock}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      title="Reset your password"
                      className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-black py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-white"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                      boxShadow: '0 10px 40px rgba(124,58,237,0.3)',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <GradientSpinner />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-transparent text-slate-600 font-bold uppercase tracking-widest text-[10px]"
                      style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(11,15,26,0.9))', borderRadius: 9999 }}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social login */}
                <SocialButton
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  }
                  label="Google Account"
                  onClick={handleGoogleLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signup link */}
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold transition-colors hover:underline"
              style={{
                backgroundImage: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Create one for free
            </Link>
          </p>
        </div>

        {/* Bottom trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-6 text-slate-600 text-xs font-semibold"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure login
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            50k+ creators
          </span>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="fixed top-20 left-20 z-20 pointer-events-none hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-6 h-6 text-brand-primary/40" />
      </motion.div>
      <motion.div
        className="fixed bottom-32 right-24 z-20 pointer-events-none hidden lg:block"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Star className="w-5 h-5 text-brand-secondary/30" />
      </motion.div>
    </div>
  );
}
