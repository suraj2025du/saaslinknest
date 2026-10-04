'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Particles } from '@/components/public/Particles';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Palette,
  Globe,
  ShieldCheck,
  Zap,
  Users,
  Star,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Check,
  Link2,
  Clock,
  Lock,
  TrendingUp,
  MousePointerClick,
  MapPin,
  Smartphone,
  Palette as PaletteIcon,
  Code,
  Heart,
  Eye,
  Share2,
  Layers,
  Wand2,
  ChevronRight,
  Menu,
  X,
  Play,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Utility: animated counter
/* ------------------------------------------------------------------ */
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Floating Orb
/* ------------------------------------------------------------------ */
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, -15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-[#0B0F1A]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-black text-white tracking-tight">
              Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Nest</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Blog', 'FAQ'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="relative group px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Get Started Free</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="home-mobile-menu-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button className="absolute top-5 right-6 text-white" onClick={() => setMobileOpen(false)}>
              <X className="w-7 h-7" />
            </button>
            {['Features', 'Pricing', 'Blog', 'FAQ'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-2xl font-bold text-white hover:text-[#EC4899] transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold">
              Get Started Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section
/* ------------------------------------------------------------------ */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#0B0F1A]">
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,58,237,0.5), transparent), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(236,72,153,0.4), transparent), radial-gradient(ellipse 70% 40% at 50% 50%, rgba(6,182,212,0.3), transparent)',
              'radial-gradient(ellipse 70% 50% at 70% 20%, rgba(6,182,212,0.5), transparent), radial-gradient(ellipse 80% 60% at 30% 80%, rgba(124,58,237,0.4), transparent), radial-gradient(ellipse 60% 40% at 60% 40%, rgba(236,72,153,0.3), transparent)',
              'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,58,237,0.5), transparent), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(236,72,153,0.4), transparent), radial-gradient(ellipse 70% 40% at 50% 50%, rgba(6,182,212,0.3), transparent)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating orbs */}
      <FloatingOrb className="absolute top-20 left-[10%] w-72 h-72 bg-[#7C3AED]/20 rounded-full blur-[100px]" delay={0} />
      <FloatingOrb className="absolute bottom-20 right-[10%] w-96 h-96 bg-[#EC4899]/15 rounded-full blur-[120px]" delay={2} />
      <FloatingOrb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[130px]" delay={4} />

      <Particles />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <motion.div style={{ y: y2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            The #1 Link-in-Bio Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
          >
            <span className="text-white">Your Links,</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
              Supercharged.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-medium"
          >
            One beautiful link to showcase everything you do. Track clicks, customize themes, and grow your audience -- all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Link href="/signup" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: '0 0 60px 10px rgba(124,58,237,0.4)' }} />
              <span className="relative z-10">Claim Your LinkNest</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B0F1A] bg-slate-800 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/64?img=${i + 10}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-300">50k+ creators</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right -- Phone Mockup */}
        <motion.div style={{ y: y1 }} className="relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/30 via-[#EC4899]/20 to-[#06B6D4]/30 blur-[80px] rounded-full scale-110 -z-10" />

            {/* Phone body */}
            <div className="relative w-[300px] sm:w-[320px] bg-[#111827] rounded-[3rem] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#0B0F1A] rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="bg-gradient-to-b from-[#1E293B] to-[#0B0F1A] rounded-[3rem] pt-12 pb-8 px-6 min-h-[580px] flex flex-col">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] p-[3px] mb-3 shadow-lg shadow-[#7C3AED]/30">
                    <div className="w-full h-full rounded-full bg-[#111827] overflow-hidden relative">
                      <Image src="https://i.pravatar.cc/160?img=32" alt="" fill className="object-cover" />
                    </div>
                  </div>
                  <p className="text-white font-bold text-base">@alexrivera</p>
                  <p className="text-slate-500 text-xs">Creator &middot; Designer</p>
                </div>

                {/* Link cards */}
                <div className="space-y-3 flex-1">
                  {[
                    { icon: Play, label: 'Latest YouTube Video', color: 'from-red-500 to-pink-500' },
                    { icon: Globe, label: 'My Portfolio', color: 'from-[#7C3AED] to-[#06B6D4]' },
                    { icon: Share2, label: 'Follow on Twitter', color: 'from-blue-400 to-cyan-400' },
                    { icon: Heart, label: 'Support My Work', color: 'from-[#EC4899] to-orange-400' },
                    { icon: Layers, label: 'All My Links', color: 'from-emerald-400 to-teal-500' },
                  ].map((link, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0`}>
                        <link.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors truncate">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-[#7C3AED]" /> LinkNest
                  </p>
                </div>
              </div>
            </div>

            {/* Floating stat card #1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-12 top-1/3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Clicks Today</p>
                  <p className="text-white font-black text-sm">12,847</p>
                </div>
              </div>
            </motion.div>

            {/* Floating stat card #2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-8 bottom-1/4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Profile Views</p>
                  <p className="text-white font-black text-sm">48.2k</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-slate-600 flex items-start justify-center p-1"
        >
          <motion.div className="w-1 h-1 rounded-full bg-[#7C3AED]" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trusted By / Stats Bar
/* ------------------------------------------------------------------ */
function StatsBar() {
  const stats = [
    { value: 50, suffix: 'K+', label: 'Active Creators', icon: Users },
    { value: 1, suffix: 'M+', label: 'Links Created', icon: Link2 },
    { value: 100, suffix: 'M+', label: 'Total Clicks Tracked', icon: MousePointerClick },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: ShieldCheck },
  ];

  return (
    <section className="relative py-20 px-6 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <s.icon className="w-5 h-5 text-[#7C3AED]" />
              <span className="text-3xl md:text-4xl font-black text-white">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </span>
            </div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Grid
/* ------------------------------------------------------------------ */
const FEATURES = [
  { icon: Link2, title: 'Unlimited Links', desc: 'Add as many links as you want. No limits, no restrictions on the Pro plan.' },
  { icon: Palette, title: 'Custom Themes', desc: 'Choose from 20+ designer themes or create your own with our powerful theme editor.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track every click, view, and geographic detail in real-time dashboards.' },
  { icon: Globe, title: 'Custom Domains', desc: 'Connect your own domain for a fully branded, professional link-in-bio page.' },
  { icon: Clock, title: 'Link Scheduling', desc: 'Schedule links to go live or expire automatically at any date and time.' },
  { icon: Lock, title: 'Password Protection', desc: 'Lock sensitive links behind a password for exclusive, gated content.' },
  { icon: Smartphone, title: 'Deep Linking', desc: 'Open apps directly -- Instagram, Spotify, YouTube -- with native deep links.' },
  { icon: Wand2, title: 'AI Link Optimization', desc: 'Let AI suggest the best order, timing, and placement for maximum clicks.' },
  { icon: Share2, title: 'Social Integrations', desc: 'Connect 30+ platforms including TikTok, Instagram, YouTube, and more.' },
];

function FeaturesGrid() {
  return (
    <section className="relative py-32 px-6">
      {/* Background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED] mb-4">Features</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Everything you need, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">nothing you don&apos;t.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Powerful features designed to help you create, share, and grow your online presence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl overflow-hidden hover:border-[#7C3AED]/30 transition-all duration-500"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/0 via-[#EC4899]/0 to-[#06B6D4]/0 group-hover:from-[#7C3AED]/5 group-hover:via-[#EC4899]/5 group-hover:to-[#06B6D4]/5 transition-all duration-500" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#EC4899]/20 flex items-center justify-center mb-6 border border-white/5 group-hover:border-[#7C3AED]/30 transition-colors"
                >
                  <f.icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-[#7C3AED] to-[#EC4899]" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Preview Section
/* ------------------------------------------------------------------ */
function PreviewSection() {
  const [activeTheme, setActiveTheme] = useState(0);
  const themes = [
    { name: 'Midnight', bg: 'from-[#0B0F1A] to-[#1E293B]', accent: 'from-[#7C3AED] to-[#EC4899]' },
    { name: 'Sunset', bg: 'from-orange-950 to-rose-950', accent: 'from-orange-400 to-pink-500' },
    { name: 'Ocean', bg: 'from-blue-950 to-cyan-950', accent: 'from-cyan-400 to-blue-500' },
    { name: 'Forest', bg: 'from-green-950 to-emerald-950', accent: 'from-emerald-400 to-teal-500' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveTheme((prev) => (prev + 1) % themes.length), 3000);
    return () => clearInterval(timer);
  }, [themes.length]);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4899] mb-4">Themes</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Beautiful themes that </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#06B6D4]">convert visitors.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Phone preview */}
          <div className="relative flex-shrink-0">
            <div className={`w-[280px] bg-gradient-to-b ${themes[activeTheme].bg} rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden transition-all duration-700`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/50 rounded-b-xl z-20" />
              <div className="pt-10 pb-6 px-5 min-h-[480px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTheme}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${themes[activeTheme].accent} p-[2px] mb-4`}>
                      <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                        <Image src={`https://i.pravatar.cc/128?img=${activeTheme + 20}`} alt="" fill className="object-cover" />
                      </div>
                    </div>
                    <p className="text-white font-bold text-sm mb-6">@creator</p>
                    <div className="w-full space-y-2.5">
                      {['My Website', 'Latest Video', 'Shop Now', 'Contact'].map((label, j) => (
                        <div key={j} className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${themes[activeTheme].accent} text-white text-xs font-bold text-center opacity-90`}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Theme picker */}
          <div className="flex flex-col gap-4">
            {themes.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTheme(i)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 ${activeTheme === i
                    ? 'bg-white/10 border-[#7C3AED]/50 shadow-lg shadow-[#7C3AED]/10'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.accent}`} />
                <span className={`font-bold text-sm ${activeTheme === i ? 'text-white' : 'text-slate-400'}`}>{t.name}</span>
                {activeTheme === i && <Check className="w-4 h-4 text-[#7C3AED] ml-auto" />}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Analytics Showcase
/* ------------------------------------------------------------------ */
function AnalyticsShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const bars = [45, 72, 58, 90, 65, 82, 95, 70, 88, 60, 78, 92];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#06B6D4] mb-4">Analytics</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              <span className="text-white">Data-driven </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">growth insights.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 font-medium leading-relaxed">
              Understand your audience with real-time analytics. Track clicks, views, geographic data, device types, and referral sources -- all in a beautiful dashboard.
            </p>
            <ul className="space-y-4">
              {['Real-time click tracking', 'Geographic & device analytics', 'Referral source breakdown', 'Export reports as CSV'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-slate-300 font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-[#06B6D4]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#06B6D4]" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mockup chart */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              {/* Chart header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Clicks</p>
                  <p className="text-3xl font-black text-white">24,847</p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +12.5%
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-2 h-40">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${h}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-[#7C3AED] to-[#EC4899] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  />
                ))}
              </div>

              {/* Month labels */}
              <div className="flex justify-between mt-3">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
                  <span key={i} className="flex-1 text-center text-[10px] text-slate-600 font-bold">{m}</span>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
                {[
                  { label: 'Views', value: '48.2K' },
                  { label: 'CTR', value: '51.6%' },
                  { label: 'Countries', value: '89' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[10px] text-slate-600 font-bold uppercase">{stat.label}</p>
                    <p className="text-lg font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials
/* ------------------------------------------------------------------ */
function Testimonials() {
  const testimonials = [
    { name: 'Alex Rivers', role: 'Lifestyle Creator, 250K followers', text: 'LinkNest completely transformed how I connect with my audience. The analytics alone are worth it -- I can see exactly what my followers engage with.', avatar: 40 },
    { name: 'Sarah Chen', role: 'Tech Influencer, 180K followers', text: 'Finally, a link-in-bio tool that actually feels premium. The custom domain support and theme options are exactly what serious creators need.', avatar: 44 },
    { name: 'Marcus Thorne', role: 'Fitness Coach, 500K followers', text: 'The scheduling feature is incredible. I plan my entire week of workout launches and they go live automatically. Game changer.', avatar: 52 },
    { name: 'Priya Sharma', role: 'Art & Design, 90K followers', text: 'The themes are absolutely gorgeous. My LinkNest page looks like it was designed by a professional. I get compliments on it all the time.', avatar: 38 },
    { name: 'Jake Morrison', role: 'Musician, 320K followers', text: 'Deep linking to Spotify and Apple Music has increased my streams by 30%. The technical features here are unmatched.', avatar: 57 },
    { name: 'Emma Davis', role: 'Startup Founder', text: 'We use LinkNest for all our team members. The ability to track which channels drive the most traffic is invaluable for our marketing.', avatar: 45 },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EC4899]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4899] mb-4">Testimonials</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Loved by </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#06B6D4]">50,000+ creators.</span>
          </h2>
          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-2">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-slate-500 text-sm font-semibold">4.9/5 from 2,000+ reviews</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:border-[#EC4899]/30 transition-all duration-500"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-slate-300 leading-relaxed text-sm font-medium mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden relative border border-white/10">
                  <Image src={`https://i.pravatar.cc/80?img=${t.avatar}`} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-600 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing
/* ------------------------------------------------------------------ */
function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for getting started',
      cta: 'Get Started',
      href: '/signup',
      popular: false,
      features: ['Up to 50 links', 'Basic analytics', '5 themes', 'LinkNest subdomain', 'Community support'],
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      desc: 'For serious creators',
      cta: 'Start Pro Trial',
      href: '/signup',
      popular: true,
      features: ['Unlimited links', 'Advanced analytics', 'All 20+ themes', 'Custom domain', 'Link scheduling', 'Password protection', 'Priority support', 'Remove LinkNest branding'],
    },
    {
      name: 'Business',
      price: '$39',
      period: '/month',
      desc: 'For teams and agencies',
      cta: 'Contact Sales',
      href: '/contact',
      popular: false,
      features: ['Everything in Pro', 'Up to 25 team members', 'White-label solution', 'API access', 'Custom integrations', 'Dedicated account manager', '99.99% SLA', 'Onboarding support'],
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED] mb-4">Pricing</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Simple, transparent </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">pricing.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative p-8 rounded-3xl border transition-all duration-500 ${plan.popular
                  ? 'bg-gradient-to-b from-[#7C3AED]/10 to-[#EC4899]/5 border-[#7C3AED]/30 shadow-2xl shadow-[#7C3AED]/10 scale-[1.03]'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7C3AED]/30"
                  >
                    Most Popular
                  </motion.div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
                </div>
              </div>

              <Link href={plan.href} className={`block w-full py-3.5 rounded-xl text-center text-sm font-bold transition-all duration-300 mb-8 ${plan.popular
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/40'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}>
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-[#7C3AED]' : 'text-slate-600'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ
/* ------------------------------------------------------------------ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'Is LinkNest really free?', a: 'Yes! Our Starter plan is completely free and includes up to 50 links, basic analytics, and access to 5 themes. No credit card required.' },
    { q: 'Can I use my own custom domain?', a: 'Absolutely! Pro and Business plan users can connect their own custom domain for a fully branded, professional experience.' },
    { q: 'How do analytics work?', a: 'LinkNest tracks every click and view on your links in real-time. You can see geographic data, device types, referral sources, and much more from your dashboard.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time with no penalties. Your account will remain active until the end of your current billing period.' },
    { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 30 days for a full refund.' },
    { q: 'What kind of support do you offer?', a: 'Starter users get community support. Pro users get priority email support, and Business users get a dedicated account manager with guaranteed response times.' },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#06B6D4] mb-4">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
            <span className="text-white">Frequently asked </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">questions.</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-bold text-sm pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#EC4899]/10 to-[#06B6D4]/20" />
      <FloatingOrb className="absolute top-10 right-10 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px]" delay={0} />
      <FloatingOrb className="absolute bottom-10 left-10 w-72 h-72 bg-[#06B6D4]/15 rounded-full blur-[120px]" delay={2} />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-10 h-10 text-[#7C3AED]" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
            <span className="text-white">Ready to build your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">digital empire?</span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            Join 50,000+ creators who trust LinkNest with their digital identity. Start free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Get Started for Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl text-lg font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Explore Features
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer
/* ------------------------------------------------------------------ */
function Footer() {
  const linkGroups = [
    {
      title: 'Product',
      links: [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }, { label: 'Themes', href: '/dashboard' }, { label: 'Changelog', href: '/blog' }],
    },
    {
      title: 'Company',
      links: [{ label: 'About', href: '/about' }, { label: 'Blog', href: '/blog' }, { label: 'Careers', href: '/team' }, { label: 'Contact', href: '/contact' }],
    },
    {
      title: 'Resources',
      links: [{ label: 'Documentation', href: '/faq' }, { label: 'Help Center', href: '/faq' }, { label: 'Community', href: '/blog' }, { label: 'Status', href: '/' }],
    },
    {
      title: 'Legal',
      links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'GDPR', href: '/privacy' }],
    },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white">LinkNest</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">The premium link-in-bio platform for creators who care about their digital presence.</p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} LinkNest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Twitter', 'GitHub', 'Discord'].map((social) => (
              <a key={social} href="#" className="text-slate-600 text-xs hover:text-white transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE (assembles all sections)
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 selection:bg-[#7C3AED]/30 antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        <PreviewSection />
        <AnalyticsShowcase />
        <Testimonials />
        <Pricing />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
