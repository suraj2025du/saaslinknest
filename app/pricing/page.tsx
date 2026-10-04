'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Particles } from '@/components/public/Particles';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  CheckCircle2,
  X,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Crown,
  Rocket,
  Building2,
  Infinity as InfinityIcon,
  Users,
  BarChart3,
  Palette,
  Globe,
  Clock,
  HeadphonesIcon,
  Eye,
  TrendingUp,
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
/*  Pricing Card
/* ------------------------------------------------------------------ */
function PricingCard({
  icon: Icon,
  title,
  price,
  period,
  description,
  features = [],
  isPopular = false,
  ctaText = 'Get Started',
  ctaHref = '/signup',
  gradientFrom = '#7C3AED',
  gradientTo = '#EC4899',
  delay = 0,
}: {
  icon: any;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  ctaHref?: string;
  gradientFrom?: string;
  gradientTo?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className={`relative p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group ${isPopular
        ? 'bg-gradient-to-b from-[#7C3AED]/15 via-[#EC4899]/8 to-[#0B0F1A]/90 border-[#7C3AED]/40 shadow-2xl shadow-[#7C3AED]/20 z-10'
        : 'bg-white/[0.03] border-white/5 hover:border-white/10 backdrop-blur-xl'
        }`}
    >
      {/* Animated glow behind popular card */}
      {isPopular && (
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-1 bg-gradient-to-br from-[#7C3AED]/20 via-[#EC4899]/10 to-[#06B6D4]/20 rounded-[2.5rem] blur-xl -z-10"
        />
      )}

      {/* Popular badge with pulse */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#7C3AED]/40 flex items-center gap-2"
          >
            <Star className="w-3 h-3 fill-white" />
            Most Popular
          </motion.div>
        </div>
      )}

      {/* Icon + Title */}
      <div className="mb-8">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[${gradientFrom}]/20 to-[${gradientTo}]/20 flex items-center justify-center mb-5 border border-white/5`}
        >
          <Icon className={`w-7 h-7 text-transparent bg-clip-text bg-gradient-to-br from-[${gradientFrom}] to-[${gradientTo}]`} />
        </motion.div>
        <h3 className="text-2xl font-black text-white tracking-tight mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{price}</span>
          <span className="text-base text-slate-500 font-bold">{period}</span>
        </div>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      {/* Features */}
      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <motion.li
            key={f}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.05 }}
            className="flex items-center gap-3 text-sm text-slate-300 font-medium group/item"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`w-5 h-5 rounded-full bg-gradient-to-br from-[${gradientFrom}]/20 to-[${gradientTo}]/20 flex items-center justify-center flex-shrink-0`}
            >
              <Check className={`w-3 h-3 text-[${gradientFrom}]`} strokeWidth={3} />
            </motion.div>
            {f}
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href={ctaHref}
        className={`group/btn relative block w-full py-4 rounded-2xl text-center text-sm font-black uppercase tracking-wider overflow-hidden transition-all duration-300 ${isPopular
          ? 'text-white shadow-xl shadow-[#7C3AED]/30 hover:shadow-2xl hover:shadow-[#7C3AED]/50'
          : 'text-white bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
      >
        {isPopular ? (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" style={{ boxShadow: '0 0 40px 5px rgba(124,58,237,0.4)' }} />
          </>
        ) : null}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {ctaText}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item
/* ------------------------------------------------------------------ */
function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-xl hover:border-white/10 transition-colors"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 md:px-8 py-5 text-left"
      >
        <span className="text-white font-bold text-sm md:text-base pr-4 flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 md:px-8 pb-5 text-slate-400 text-sm leading-relaxed font-medium pl-14">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE
/* ------------------------------------------------------------------ */
export default function PricingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const plans = [
    {
      icon: Zap,
      name: 'Starter',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for hobbyists and creators just starting their digital journey.',
      features: [
        'Up to 50 links per profile',
        '5 Basic designer themes',
        'Basic click analytics',
        'LinkNest subdomain',
        'Community support',
      ],
      cta: 'Get Started Free',
      href: '/signup',
      gradientFrom: '#6B7280',
      gradientTo: '#9CA3AF',
    },
    {
      icon: Rocket,
      name: 'Pro',
      price: '$12',
      period: '/month',
      desc: 'For serious creators building a professional brand and digital empire.',
      features: [
        'Unlimited links',
        'All 20+ premium themes',
        'Advanced real-time analytics',
        'Custom domain connection',
        'Link scheduling & expiry',
        'Password protection',
        'Remove LinkNest branding',
        'Priority 24/7 support',
      ],
      cta: 'Start Pro Trial',
      href: '/signup',
      gradientFrom: '#7C3AED',
      gradientTo: '#EC4899',
      popular: true,
    },
    {
      icon: Building2,
      name: 'Business',
      price: '$39',
      period: '/month',
      desc: 'For teams, agencies, and businesses managing multiple creator accounts.',
      features: [
        'Everything in Pro',
        'Up to 25 team members',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        '99.99% uptime SLA',
        'Onboarding & training support',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      gradientFrom: '#06B6D4',
      gradientTo: '#7C3AED',
    },
    {
      icon: InfinityIcon,
      name: 'Lifetime',
      price: '$149',
      period: 'once',
      desc: 'One payment. Forever access. The ultimate investment in your brand.',
      features: [
        'All Pro features included',
        'Lifetime access to all updates',
        'VIP status & exclusive badge',
        'Direct access to founders',
        'Early access to new tools',
        'Exclusive creator resources',
        'No recurring fees, ever',
      ],
      cta: 'Claim Lifetime Access',
      href: '/signup',
      gradientFrom: '#EC4899',
      gradientTo: '#F59E0B',
    },
  ];

  const comparisonRows = [
    { feature: 'Links', starter: '50', pro: 'Unlimited', business: 'Unlimited', lifetime: 'Unlimited', icon: CheckCircle2 },
    { feature: 'Themes', starter: '5 Basic', pro: 'All 20+', business: 'All 20+ Custom', lifetime: 'All 20+ Custom', icon: Palette },
    { feature: 'Analytics', starter: 'Basic', pro: 'Advanced', business: 'Advanced + API', lifetime: 'Advanced', icon: BarChart3 },
    { feature: 'Custom Domain', starter: false, pro: true, business: true, lifetime: true, icon: Globe },
    { feature: 'Link Scheduling', starter: false, pro: true, business: true, lifetime: true, icon: Clock },
    { feature: 'Team Members', starter: '1', pro: '1', business: 'Up to 25', lifetime: '1', icon: Users },
    { feature: 'Branding Removal', starter: false, pro: true, business: true, lifetime: true, icon: Eye },
    { feature: 'Support', starter: 'Community', pro: 'Priority', business: 'Dedicated AM', lifetime: 'VIP Direct', icon: HeadphonesIcon },
    { feature: 'Uptime SLA', starter: 'Standard', pro: 'Standard', business: '99.99%', lifetime: 'Standard', icon: TrendingUp },
    { feature: 'API Access', starter: false, pro: false, business: true, lifetime: false, icon: ShieldCheck },
  ];

  const faqs = [
    {
      q: 'Is LinkNest really free?',
      a: 'Yes! Our Starter plan is completely free and includes up to 50 links, basic analytics, and access to 5 themes. No credit card required, no hidden fees.',
    },
    {
      q: 'Can I cancel my Pro subscription at any time?',
      a: 'Absolutely. You can cancel your subscription at any time from your account settings with no penalties. You will continue to have access to Pro features until the end of your current billing period.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied with your purchase, contact us within 30 days for a full refund. No questions asked.',
    },
    {
      q: 'What happens if I downgrade to the Starter plan?',
      a: 'If you downgrade, your custom domain will be disconnected and your profile will revert to a basic theme. Your links beyond the 50-link limit will be hidden but never deleted.',
    },
    {
      q: 'Is the Lifetime plan really forever?',
      a: 'Yes! One payment gives you lifetime access to all current and future Pro features for the life of the platform. No recurring fees, no surprises. It is the best value we offer.',
    },
    {
      q: 'Can I use my own custom domain?',
      a: 'Pro, Business, and Lifetime plans all support custom domain connection. Simply point your DNS records to LinkNest and configure your domain from the dashboard.',
    },
    {
      q: 'What kind of support do you offer?',
      a: 'Starter users get community support. Pro users get priority email support with fast response times. Business users get a dedicated account manager, and Lifetime users get direct access to our founding team.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 selection:bg-[#7C3AED]/30 antialiased overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 pb-20 px-6">
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

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl"
          >
            <Zap className="w-3.5 h-3.5" />
            Simple, Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
          >
            <span className="text-white">Choose Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
              Perfect Plan.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-10"
          >
            From a free starter plan to lifetime access -- find the plan that fits your creator journey. No hidden fees, cancel anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Start Free Today</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
              30-day money-back guarantee
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING CARDS ===== */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-stretch">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                icon={plan.icon}
                title={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.desc}
                features={plan.features}
                isPopular={plan.popular || false}
                ctaText={plan.cta}
                ctaHref={plan.href}
                gradientFrom={plan.gradientFrom}
                gradientTo={plan.gradientTo}
                delay={0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="relative py-24 px-6">
        {/* Subtle bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4899] mb-4">Compare Plans</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              <span className="text-white">Feature </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Breakdown</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">A detailed look at what you get with each plan.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            {/* Gradient border effect */}
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED]/30 via-[#EC4899]/30 to-[#06B6D4]/30 rounded-[2.5rem] blur-sm -z-10" />

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.03]">
                      <th className="p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Feature</th>
                      <th className="p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Zap className="w-4 h-4 text-slate-500" />
                          Starter
                        </div>
                      </th>
                      <th className="p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Rocket className="w-4 h-4 text-[#7C3AED]" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Pro</span>
                        </div>
                      </th>
                      <th className="p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Building2 className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-[#06B6D4]">Business</span>
                        </div>
                      </th>
                      <th className="p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Crown className="w-4 h-4 text-[#EC4899]" />
                          <span className="text-[#EC4899]">Lifetime</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''
                          }`}
                      >
                        <td className="p-6 md:p-8">
                          <div className="flex items-center gap-3">
                            <row.icon className="w-4 h-4 text-[#7C3AED]" />
                            <span className="text-sm font-bold text-slate-300">{row.feature}</span>
                          </div>
                        </td>
                        <td className="p-6 md:p-8 text-center text-sm font-bold text-slate-500">
                          {typeof row.starter === 'boolean' ? (
                            row.starter ? <Check className="w-4 h-4 text-slate-500 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />
                          ) : (
                            row.starter
                          )}
                        </td>
                        <td className="p-6 md:p-8 text-center text-sm font-bold text-white">
                          {typeof row.pro === 'boolean' ? (
                            row.pro ? <Check className="w-4 h-4 text-[#7C3AED] mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />
                          ) : (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">{row.pro}</span>
                          )}
                        </td>
                        <td className="p-6 md:p-8 text-center text-sm font-bold text-white">
                          {typeof row.business === 'boolean' ? (
                            row.business ? <Check className="w-4 h-4 text-[#06B6D4] mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />
                          ) : (
                            <span className="text-[#06B6D4]">{row.business}</span>
                          )}
                        </td>
                        <td className="p-6 md:p-8 text-center text-sm font-bold text-white">
                          {typeof row.lifetime === 'boolean' ? (
                            row.lifetime ? <Check className="w-4 h-4 text-[#EC4899] mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />
                          ) : (
                            <span className="text-[#EC4899]">{row.lifetime}</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-24 px-6">
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
            <p className="text-slate-400 font-medium max-w-lg mx-auto">Everything you need to know about our plans and billing.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="relative py-20 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: 'Secure Payments',
              desc: 'Processed via Stripe with 256-bit encryption.',
              color: 'text-[#06B6D4]',
            },
            {
              icon: Star,
              title: '30-Day Guarantee',
              desc: 'Love it or get your money back. No questions asked.',
              color: 'text-[#EC4899]',
            },
            {
              icon: Zap,
              title: 'Instant Activation',
              desc: 'Get access to premium features immediately after payment.',
              color: 'text-[#7C3AED]',
            },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <badge.icon className={`w-10 h-10 ${badge.color} flex-shrink-0`} />
              <div>
                <h4 className="text-base font-black text-white tracking-tight mb-1">{badge.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
                digital empire?
              </span>
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
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
