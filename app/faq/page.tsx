'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Code,
  HeadphonesIcon,
  Globe,
  Palette,
  BarChart3,
  Link2,
  Users,
  Lock,
  Clock,
  Smartphone,
  Wand2,
  Heart,
  Check,
  Menu,
  X,
  ChevronRight,
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
                {item === 'FAQ' ? (
                  <span className="text-white">{item}</span>
                ) : (
                  item
                )}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-300 ${item === 'FAQ' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
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
/*  FAQ Data
/* ------------------------------------------------------------------ */
const FAQ_CATEGORIES = [
  {
    id: 'general',
    name: 'General',
    icon: Sparkles,
    gradient: 'from-[#7C3AED] to-[#EC4899]',
    questions: [
      { q: 'What is LinkNest?', a: 'LinkNest is a powerful link-in-bio platform that lets you create a beautiful, customizable landing page with all your important links in one place. Perfect for creators, businesses, and professionals who want to share multiple links across social media platforms.' },
      { q: 'Is LinkNest really free?', a: 'Yes! Our Starter plan is completely free and includes up to 50 links, basic analytics, and access to 5 themes. No credit card required -- start building your link page today.' },
      { q: 'Who can use LinkNest?', a: 'Anyone! Whether you\'re an influencer, musician, entrepreneur, educator, or just someone who wants a clean way to share their online presence, LinkNest is designed for you.' },
    ],
  },
  {
    id: 'features',
    name: 'Features',
    icon: Zap,
    gradient: 'from-[#EC4899] to-[#06B6D4]',
    questions: [
      { q: 'How many links can I add?', a: 'Starter plan users can add up to 50 links. Pro and Business plan users enjoy unlimited links -- add as many as you need without any restrictions.' },
      { q: 'Can I use my own custom domain?', a: 'Absolutely! Pro and Business plan users can connect their own custom domain for a fully branded, professional link-in-bio experience. Setup takes just a few minutes.' },
      { q: 'What analytics are available?', a: 'LinkNest tracks every click and view in real-time. You get detailed insights including geographic data, device types, referral sources, click-through rates, and time-based trends. Business users get advanced funnel analytics too.' },
      { q: 'Can I schedule links to go live at specific times?', a: 'Yes! Pro and Business users can schedule links to automatically publish or expire at any date and time. Perfect for product launches, limited-time offers, or time-sensitive content.' },
      { q: 'Do you support deep linking to apps?', a: 'Yes, LinkNest supports deep linking to 30+ platforms including Instagram, Spotify, YouTube, TikTok, and more. Users are taken directly to the app instead of a web browser.' },
    ],
  },
  {
    id: 'pricing',
    name: 'Pricing & Payments',
    icon: CreditCard,
    gradient: 'from-[#06B6D4] to-[#7C3AED]',
    questions: [
      { q: 'What plans do you offer?', a: 'We offer three plans: Starter (free forever with 50 links), Pro ($12/month with unlimited links and advanced features), and Business ($39/month with team features, API access, and white-label options).' },
      { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time with no penalties or hidden fees. Your account will remain active until the end of your current billing period.' },
      { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not completely satisfied, contact us within 30 days of purchase for a full refund -- no questions asked.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. Business plan users can also pay via invoice with NET-30 terms.' },
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: Code,
    gradient: 'from-[#7C3AED] to-[#06B6D4]',
    questions: [
      { q: 'Is LinkNest mobile-friendly?', a: 'Yes! Every LinkNest page is fully responsive and optimized for mobile, tablet, and desktop. Your page will look stunning on any device, automatically.' },
      { q: 'How fast do LinkNest pages load?', a: 'LinkNest pages are built on cutting-edge infrastructure with global CDN distribution. Average load times are under 1 second, ensuring your visitors never have to wait.' },
      { q: 'Can I integrate LinkNest with other tools?', a: 'Business plan users get full API access for custom integrations. We also offer native integrations with Google Analytics, Facebook Pixel, Zapier, and more on all paid plans.' },
      { q: 'Is my data secure?', a: 'Security is our top priority. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We\'re GDPR compliant, SOC 2 Type II certified, and undergo regular security audits.' },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: HeadphonesIcon,
    gradient: 'from-[#EC4899] to-[#7C3AED]',
    questions: [
      { q: 'What kind of support do you offer?', a: 'Starter users get access to our community forums and knowledge base. Pro users receive priority email support with guaranteed 24-hour response times. Business users get a dedicated account manager and live chat support.' },
      { q: 'How do I contact support?', a: 'You can reach us via email at support@linknest.tech, through the in-app chat widget, or by visiting our help center. Business users can also contact their dedicated account manager directly.' },
      { q: 'Do you offer onboarding help?', a: 'Yes! All new users get access to our interactive onboarding wizard. Business plan users also receive personalized onboarding with a dedicated specialist who helps set up your page, domains, and integrations.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion Item
/* ------------------------------------------------------------------ */
function AccordionItem({
  question,
  index,
}: {
  question: { q: string; a: string };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-xl hover:border-white/10 transition-colors duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3 pr-4">
          <motion.div
            animate={{ scale: isOpen ? 1.1 : 1 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] flex-shrink-0"
          />
          <span className="text-white font-bold text-sm">{question.q}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-[#7C3AED] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pl-11">
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {question.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Section
/* ------------------------------------------------------------------ */
function FAQSection({
  category,
}: {
  category: (typeof FAQ_CATEGORIES)[number];
}) {
  const Icon = category.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {category.name}
        </h2>
        <div className={`flex-1 h-px bg-gradient-to-r ${category.gradient} opacity-20`} />
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {category.questions.map((q, i) => (
          <AccordionItem key={i} question={q} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section
/* ------------------------------------------------------------------ */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-6">
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
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Got Questions? We&apos;ve Got Answers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
        >
          <span className="text-white">Frequently Asked</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
            Questions.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Everything you need to know about LinkNest. Can&apos;t find what you&apos;re looking for? Reach out to our support team.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Bar
/* ------------------------------------------------------------------ */
function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="relative max-w-xl mx-auto mb-16"
    >
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)'
            : '0 0 0 1px rgba(255,255,255,0.05)',
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 via-[#EC4899]/20 to-[#06B6D4]/20 opacity-0 transition-opacity duration-300 pointer-events-none" style={{ opacity: focused ? 1 : 0 }} />
        <div className="relative flex items-center bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-2xl">
          <Search className={`w-5 h-5 ml-4 flex-shrink-0 transition-colors duration-300 ${focused ? 'text-[#7C3AED]' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search questions..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearch(e.target.value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent px-4 py-4 text-sm text-white placeholder-slate-500 outline-none font-medium"
          />
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                setValue('');
                onSearch('');
              }}
              className="mr-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
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
            <span className="text-white">Still have questions?</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
              We&apos;re here to help.
            </span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            Can&apos;t find what you&apos;re looking for? Our support team is just a message away. Or start building your LinkNest today -- it&apos;s free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-[#7C3AED]/30">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl text-lg font-bold text-slate-300 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <HeadphonesIcon className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page
/* ------------------------------------------------------------------ */
export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <main className="relative min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />
      <HeroSection />

      {/* FAQ Content */}
      <section className="relative py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={setSearchQuery} />

          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <FAQSection key={category.id} category={category} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Try a different search term or browse all questions above.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
