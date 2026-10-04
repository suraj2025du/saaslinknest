'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Particles } from '@/components/public/Particles';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Palette,
  Globe,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  Link2,
  Clock,
  Lock,
  Check,
  Play,
  Heart,
  Code,
} from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#EC4899] rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-black text-white">Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Nest</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-bold text-white hover:text-[#7C3AED] transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About</Link>
          <Link href="/faq" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">FAQ</Link>
          <Link href="/blog" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-sm font-black rounded-xl hover:shadow-lg hover:shadow-[#7C3AED]/30 transition-all">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Data
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Palette,
    title: 'Designer Themes',
    subtitle: 'Customization',
    description: 'Choose from 20+ premium designer themes or create your own with our powerful editor.',
    color: 'from-[#7C3AED] to-[#EC4899]',
    features: ['10+ premium themes', 'Custom CSS', 'Animated backgrounds', 'Advanced typography'],
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    subtitle: 'Insights',
    description: 'Track every click, view, geographic detail, and referral source in real-time dashboards.',
    color: 'from-[#06B6D4] to-[#7C3AED]',
    features: ['Click tracking', 'Geographic breakdown', 'Referrer analysis', 'Weekly reports'],
  },
  {
    icon: Link2,
    title: 'Smart Links',
    subtitle: 'Intelligence',
    description: 'Schedule link visibility, password-protect content, or use deep links to open apps directly.',
    color: 'from-[#EC4899] to-[#06B6D4]',
    features: ['Scheduled visibility', 'Password protection', 'App deep linking', 'Custom thumbnails'],
  },
  {
    icon: Clock,
    title: 'Link Scheduling',
    subtitle: 'Automation',
    description: 'Plan your entire week and let LinkNest handle the rest with automatic scheduling.',
    color: 'from-[#7C3AED] to-[#06B6D4]',
    features: ['Auto go-live', 'Auto expiry', 'Recurring schedules', 'Timezone support'],
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    subtitle: 'Branding',
    description: 'Connect your own domain for a fully branded, professional link-in-bio page.',
    color: 'from-[#06B6D4] to-[#EC4899]',
    features: ['Free SSL', 'DNS management', 'Redirect rules', 'Subdomain support'],
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    subtitle: 'Protection',
    description: 'GDPR compliant with bank-grade AES-256 encryption. Your data is always protected.',
    color: 'from-[#10B981] to-[#06B6D4]',
    features: ['AES-256 encryption', 'GDPR compliant', 'SOC 2 certified', '99.9% uptime'],
  },
  {
    icon: Sparkles,
    title: 'AI Optimization',
    subtitle: 'Intelligence',
    description: 'Let AI suggest the best order, timing, and placement for maximum clicks.',
    color: 'from-[#F59E0B] to-[#EC4899]',
    features: ['Smart ordering', 'Timing suggestions', 'A/B testing', 'Conversion insights'],
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    subtitle: 'Workflow',
    description: 'Invite managers, editors, and analysts to help run your profile with granular permissions.',
    color: 'from-[#8B5CF6] to-[#06B6D4]',
    features: ['Role-based access', 'Activity logs', 'Team chat', 'Approval workflows'],
  },
  {
    icon: Heart,
    title: 'Social Integrations',
    subtitle: 'Connectivity',
    description: 'Connect 30+ platforms including TikTok, Instagram, YouTube, Spotify, and more.',
    color: 'from-[#EC4899] to-[#7C3AED]',
    features: ['30+ platforms', 'Auto-sync', 'Cross-posting', 'Unified inbox'],
  },
];

/* ------------------------------------------------------------------ */
/*  Feature Card Component
/* ------------------------------------------------------------------ */
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/10 transition-all duration-300 h-full flex flex-col">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
          <feature.icon className="w-7 h-7 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-wider mb-3 w-fit">
          <Sparkles className="w-3 h-3" />
          {feature.subtitle}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{feature.description}</p>

        {/* Feature list */}
        <ul className="space-y-2 mb-6">
          {feature.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        {/* Learn more */}
        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] group-hover:gap-3 transition-all">
          Learn more
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section
/* ------------------------------------------------------------------ */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0B0F1A]" />

      {/* Animated gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Floating orbs */}
      <FloatingOrb className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[120px]" delay={0} />
      <FloatingOrb className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EC4899]/20 rounded-full blur-[120px]" delay={2} />
      <FloatingOrb className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[120px]" delay={4} />

      {/* Particles */}
      <Particles />

      {/* Content */}
      <motion.div
        style={{ y: y1 }}
        className="max-w-5xl mx-auto px-6 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-xs font-black uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Powerful Features
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8"
        >
          <span className="text-white">Everything you </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">need to grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Powerful tools to help creators build, grow, and monetize their digital presence. All in one beautiful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all hover:scale-105 flex items-center gap-2">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2">
            <Play className="w-5 h-5" />
            View Pricing
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: '50K+', label: 'Creators' },
            { value: '1M+', label: 'Links Created' },
            { value: '100M+', label: 'Total Clicks' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] mb-2">{stat.value}</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Grid Section
/* ------------------------------------------------------------------ */
function FeaturesGrid() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#7C3AED] mb-4">Features</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Nine pillars of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">creator power.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Every feature is designed to help you build, grow, and monetize your digital presence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Section
/* ------------------------------------------------------------------ */
function CTASection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-16 h-16 text-[#7C3AED] mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-white">Ready to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">get started?</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Join 50,000+ creators already using LinkNest to build their digital empire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all hover:scale-105 flex items-center gap-2">
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
              Contact Sales
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
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#EC4899] rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-black text-white">Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Nest</span></span>
        </div>
        <div className="text-slate-500 text-sm font-medium">
          © 2026 LinkNest. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">Terms</Link>
          <Link href="/contact" className="text-sm text-slate-500 hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page
/* ------------------------------------------------------------------ */
export default function FeaturesPage() {
  return (
    <main className="bg-[#0B0F1A] min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
