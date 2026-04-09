'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, ArrowLeft, CheckCircle2, Star, Mail, Lock, User, Eye, EyeOff,
  Loader2, ChevronRight, Sparkles, Check, X, ShieldCheck
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animated Background (shared with login)                            */
/* ------------------------------------------------------------------ */

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-surface-950" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(-45deg, #06B6D4, #7C3AED, #EC4899, #8B5CF6)',
          backgroundSize: '400% 400%',
          animation: 'gradient-xy 15s ease infinite',
        }}
      />

      {/* Floating orbs */}
      {[
        { size: 550, color: 'rgba(6,182,212,0.3)', x: '15%', y: '15%', duration: 22, delay: 0 },
        { size: 500, color: 'rgba(124,58,237,0.35)', x: '65%', y: '20%', duration: 20, delay: 2 },
        { size: 450, color: 'rgba(236,72,153,0.25)', x: '40%', y: '65%', duration: 24, delay: 1 },
        { size: 350, color: 'rgba(139,92,246,0.3)', x: '75%', y: '75%', duration: 18, delay: 3 },
        { size: 300, color: 'rgba(6,182,212,0.2)', x: '10%', y: '70%', duration: 26, delay: 4 },
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
            y: [0, -50, 30, -20, 0],
            x: [0, 30, -40, 20, 0],
            scale: [1, 1.08, 0.95, 1.03, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
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
/*  Password Strength Indicator                                        */
/* ------------------------------------------------------------------ */

interface PasswordStrengthProps {
  password: string;
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Very Weak', color: '#EF4444' };
    if (score === 2) return { score: 2, label: 'Weak', color: '#F97316' };
    if (score === 3) return { score: 3, label: 'Fair', color: '#EAB308' };
    if (score === 4) return { score: 4, label: 'Strong', color: '#22C55E' };
    return { score: 5, label: 'Very Strong', color: '#06B6D4' };
  };

  const strength = getStrength(password);
  const segments = 5;

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Password strength</span>
        <motion.span
          key={strength.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-bold"
          style={{ color: strength.color }}
        >
          {strength.label}
        </motion.span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/5"
            initial={false}
            animate={{
              background: i < strength.score ? strength.color : 'rgba(255,255,255,0.05)',
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
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
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(124,58,237,0.1))',
        }}
      />
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Signup Page                                                        */
/* ------------------------------------------------------------------ */

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              background: 'linear-gradient(90deg, transparent, #06B6D4, #7C3AED, transparent)',
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
                background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
                boxShadow: '0 10px 40px rgba(6,182,212,0.35)',
              }}
            >
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
                Create account.
              </span>
            </h1>
            <p className="text-slate-400 font-medium">Join 50,000+ creators building their brand.</p>
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

          <form onSubmit={handleSignup} className="space-y-5">
            <AuthInput
              icon={User}
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Alex Johnson"
              autoComplete="name"
            />
            <AuthInput
              icon={Mail}
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
              autoComplete="email"
            />
            <div>
              <AuthInput
                icon={Lock}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
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
              {/* Password strength indicator */}
              <div className="mt-3">
                <PasswordStrength password={password} />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <motion.button
                type="button"
                role="checkbox"
                aria-checked={agreeTerms}
                onClick={() => setAgreeTerms(!agreeTerms)}
                whileTap={{ scale: 0.9 }}
                className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 overflow-hidden"
                style={{
                  background: agreeTerms
                    ? 'linear-gradient(135deg, #7C3AED, #EC4899)'
                    : 'rgba(255,255,255,0.05)',
                  border: agreeTerms ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: agreeTerms ? '0 2px 10px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                <AnimatePresence>
                  {agreeTerms && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -45 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <span className="text-sm text-slate-400 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-primary hover:underline font-semibold" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-primary hover:underline font-semibold" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full font-black py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-white"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
                boxShadow: '0 10px 40px rgba(6,182,212,0.3)',
              }}
            >
              {isLoading ? (
                <>
                  <GradientSpinner />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social signup */}
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
            onClick={async () => {
              try {
                const { handleGoogleSignIn } = await import('@/lib/firebase-auth');
                const result = await handleGoogleSignIn();

                if (result.success) {
                  router.push('/dashboard');
                } else {
                  setError(result.error || 'Failed to sign up with Google.');
                }
              } catch (err: any) {
                console.error('Google signup error:', err);
                setError(err.message || 'Something went wrong.');
              }
            }}
          />

          {/* Login link */}
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold transition-colors hover:underline"
              style={{
                backgroundImage: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sign in here
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
            Secure signup
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Free forever plan
          </span>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="fixed top-24 right-24 z-20 pointer-events-none hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-6 h-6 text-brand-accent/40" />
      </motion.div>
      <motion.div
        className="fixed bottom-32 left-24 z-20 pointer-events-none hidden lg:block"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Star className="w-5 h-5 text-brand-secondary/30" />
      </motion.div>
    </div>
  );
}
