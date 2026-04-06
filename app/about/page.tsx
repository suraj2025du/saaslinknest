'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'motion/react';
import {
  ArrowRight,
  Zap,
  Sparkles,
  Users,
  Target,
  Heart,
  Lightbulb,
  Rocket,
  Globe,
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  Code,
  Palette,
  Eye,
  Menu,
  X,
  ChevronDown,
  Star,
  MapPin,
  Coffee,
  Trophy,
  ArrowUpRight,
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
/*  Particle field
/* ------------------------------------------------------------------ */
function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
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
            <Link href="/about" className="text-sm font-medium text-white relative group">
              About
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
            </Link>
          </div>

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

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button className="absolute top-5 right-6 text-white" onClick={() => setMobileOpen(false)}>
              <X className="w-7 h-7" />
            </button>
            {['Features', 'Pricing', 'Blog', 'FAQ', 'About'].map((item) => (
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
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

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

      <motion.div
        style={{ y: y1 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl"
        >
          <Sparkles className="w-3.5 h-3.5" />
          About LinkNest
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
        >
          <span className="text-white">Our </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
            Mission
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          We believe every creator deserves a beautiful, powerful digital home. LinkNest gives you the tools to
          showcase your work, understand your audience, and grow your brand -- all from one stunning link.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/signup" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
            <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="relative z-10">Join the Movement</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="/features" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-xl transition-all">
            Explore Features
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats / Milestones
/* ------------------------------------------------------------------ */
function StatsSection() {
  const stats = [
    { value: 50, suffix: 'K+', label: 'Active Creators', icon: Users },
    { value: 1, suffix: 'M+', label: 'Links Created', icon: Zap },
    { value: 100, suffix: 'M+', label: 'Clicks Tracked', icon: TrendingUp },
    { value: 195, suffix: '+', label: 'Countries Reached', icon: Globe },
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
/*  Our Story / Timeline
/* ------------------------------------------------------------------ */
function StoryTimeline() {
  const milestones = [
    {
      year: '2022',
      quarter: 'Q1',
      title: 'The Spark',
      desc: 'A frustrated creator asked: "Why is it so hard to share everything I do online?" That question became LinkNest.',
      icon: Lightbulb,
      color: 'from-[#7C3AED] to-[#EC4899]',
    },
    {
      year: '2022',
      quarter: 'Q3',
      title: 'First Launch',
      desc: 'We shipped our MVP with 5 themes, basic analytics, and a dream. 500 creators signed up in the first week.',
      icon: Rocket,
      color: 'from-[#EC4899] to-[#06B6D4]',
    },
    {
      year: '2023',
      quarter: 'Q1',
      title: 'Pro & Custom Domains',
      desc: 'Responding to user requests, we launched Pro plans with custom domains, scheduling, and advanced analytics.',
      icon: Code,
      color: 'from-[#06B6D4] to-[#7C3AED]',
    },
    {
      year: '2023',
      quarter: 'Q4',
      title: '50,000 Creators',
      desc: 'We hit a major milestone: 50K active creators across 195 countries. The community was growing faster than ever.',
      icon: Trophy,
      color: 'from-[#7C3AED] to-[#06B6D4]',
    },
    {
      year: '2024',
      quarter: 'Q2',
      title: 'AI-Powered Features',
      desc: 'We introduced AI link optimization, smart ordering, and predictive analytics to help creators maximize every click.',
      icon: Sparkles,
      color: 'from-[#EC4899] to-[#7C3AED]',
    },
    {
      year: '2025',
      quarter: 'Now',
      title: 'The Future is LinkNest',
      desc: 'With 100M+ clicks tracked and a growing team, we\'re just getting started. The next chapter is even more exciting.',
      icon: Star,
      color: 'from-[#06B6D4] to-[#EC4899]',
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4899] mb-4">Our Story</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">From a simple idea to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#06B6D4]">a global movement.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Every great product starts with a problem worth solving. Here&apos;s how ours unfolded.
          </p>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7C3AED]/50 via-[#EC4899]/50 to-[#06B6D4]/50 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Card */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:border-[#7C3AED]/30 transition-all duration-500 inline-block max-w-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
                        <m.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[#7C3AED] text-xs font-black uppercase tracking-wider">{m.year} {m.quarter}</span>
                        <h3 className="text-xl font-bold text-white">{m.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{m.desc}</p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-[#7C3AED]/30">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Values Section
/* ------------------------------------------------------------------ */
function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: 'Creator-First',
      desc: 'Every decision we make starts with one question: does this help our creators succeed? If the answer is no, we don\'t build it.',
      gradient: 'from-[#EC4899] to-[#7C3AED]',
    },
    {
      icon: Eye,
      title: 'Radical Transparency',
      desc: 'We believe in open metrics, honest pricing, and clear communication. You should always know exactly what you\'re paying for.',
      gradient: 'from-[#7C3AED] to-[#06B6D4]',
    },
    {
      icon: Palette,
      title: 'Design Excellence',
      desc: 'Beautiful design isn\'t decoration -- it\'s respect for the people who use our product. We obsess over every pixel.',
      gradient: 'from-[#06B6D4] to-[#7C3AED]',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy by Default',
      desc: 'Your data is yours. We never sell user data, and we give you full control over what you share and with whom.',
      gradient: 'from-[#7C3AED] to-[#EC4899]',
    },
    {
      icon: Globe,
      title: 'Global from Day One',
      desc: 'We built LinkNest for the world, not just Silicon Valley. Every feature is designed to work across cultures and languages.',
      gradient: 'from-[#EC4899] to-[#06B6D4]',
    },
    {
      icon: Zap,
      title: 'Move Fast, Build Well',
      desc: 'We ship quickly but never recklessly. Speed without quality is just a faster way to break things you love.',
      gradient: 'from-[#06B6D4] to-[#EC4899]',
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EC4899]/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#06B6D4] mb-4">Our Values</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">What we stand </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">for.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            These aren&apos;t poster slogans. They&apos;re the principles that guide every product decision we make.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl overflow-hidden hover:border-[#7C3AED]/30 transition-all duration-500"
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <v.icon className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Section
/* ------------------------------------------------------------------ */
function TeamSection() {
  const team = [
    { name: 'Alex Rivera', role: 'Co-Founder & CEO', bio: 'Ex-Google. Obsessed with creator tools and design.', avatar: 32, location: 'San Francisco, CA' },
    { name: 'Priya Sharma', role: 'Co-Founder & CTO', bio: 'Full-stack engineer. Built her first SaaS at 19.', avatar: 44, location: 'London, UK' },
    { name: 'Marcus Chen', role: 'Head of Design', bio: 'Former Apple designer. Believes in pixel-perfect everything.', avatar: 53, location: 'Tokyo, JP' },
    { name: 'Jordan Blake', role: 'Head of Growth', bio: 'Scaled 3 startups from zero to millions of users.', avatar: 60, location: 'Austin, TX' },
    { name: 'Sofia Martinez', role: 'Lead Engineer', bio: 'Open-source contributor. Rust enthusiast.', avatar: 26, location: 'Barcelona, ES' },
    { name: 'Kai Nakamura', role: 'Head of Product', bio: 'Data-driven builder. Loves turning feedback into features.', avatar: 47, location: 'New York, NY' },
    { name: 'Emma Larsson', role: 'Community Lead', bio: 'Built communities of 500K+ across social platforms.', avatar: 38, location: 'Stockholm, SE' },
    { name: 'David Okonkwo', role: 'Data Engineer', bio: 'Makes analytics beautiful. Python & Go wizard.', avatar: 55, location: 'Lagos, NG' },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED] mb-4">The Team</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">The humans behind </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">the magic.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            A distributed team of creators, engineers, and dreamers building the future of digital identity.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:border-[#7C3AED]/30 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar with gradient ring */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] p-[3px] mb-5 shadow-lg shadow-[#7C3AED]/20"
                >
                  <div className="w-full h-full rounded-full bg-[#0B0F1A] overflow-hidden relative">
                    <Image
                      src={`https://i.pravatar.cc/192?img=${member.avatar}`}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{member.bio}</p>

                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{member.location}</span>
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
/*  Culture / Perks Section
/* ------------------------------------------------------------------ */
function CultureSection() {
  const perks = [
    { icon: Globe, title: 'Fully Remote', desc: 'Work from anywhere in the world. We trust our team to do their best work, wherever they are.' },
    { icon: Coffee, title: 'Flexible Hours', desc: 'No 9-to-5 here. We measure impact, not hours at a desk. Work when you feel most productive.' },
    { icon: Award, title: 'Equity for All', desc: 'Every full-time team member gets equity. When LinkNest wins, everyone wins.' },
    { icon: Target, title: 'Learning Budget', desc: '$2,000/year for courses, conferences, and books. We invest in your growth.' },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4899] mb-4">Culture</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Built by people who </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#06B6D4]">love what they do.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            We&apos;re not just building a product -- we&apos;re building a team that loves building it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group flex items-start gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:border-[#EC4899]/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#EC4899]/20 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-[#7C3AED]/30 transition-colors">
                <perk.icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-[#7C3AED] to-[#EC4899]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{perk.desc}</p>
              </div>
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
            <span className="text-white">Want to be part of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">the story?</span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            Join 50,000+ creators building their digital home with LinkNest. Free to start, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Create Your LinkNest</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl text-lg font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-xl transition-all">
              Contact Us
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (minimal)
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-500">&copy; {new Date().getFullYear()} LinkNest. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Twitter', 'GitHub'].map((link) => (
            <Link key={link} href="#" className="text-xs text-slate-600 hover:text-slate-300 transition-colors font-medium">
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page
/* ------------------------------------------------------------------ */
export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0B0F1A]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <StoryTimeline />
      <ValuesSection />
      <TeamSection />
      <CultureSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
