'use client';

import { PageLayout } from '@/components/public/PageLayout';
import { Particles } from '@/components/public/Particles';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowRight,
  Calendar,
  User,
  Search,
  Mail,
  Clock,
  Sparkles,
  X,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Types
/* ------------------------------------------------------------------ */
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  authorName: string | null;
  publishedAt: string | null;
  tags: string[] | null;
}

/* ------------------------------------------------------------------ */
/*  Floating Orb (same as homepage)
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
/*  Featured Post Card
/* ------------------------------------------------------------------ */
function FeaturedPost({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (d: string | null) => string;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[2.5rem] overflow-hidden"
      >
        {/* Gradient border via wrapper */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] rounded-[2.5rem] opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="relative bg-[#0B0F1A] rounded-[2.5rem] overflow-hidden border border-white/10">
          {/* Cover image */}
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src={post.coverImage || `https://picsum.photos/seed/featured-${post.id}/1600/700`}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent" />
            {/* Featured badge */}
            <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Featured</span>
            </div>
            {/* Tags overlay */}
            {post.tags && post.tags.length > 0 && (
              <div className="absolute top-8 right-8 flex gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-10 md:p-14">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </div>
              {post.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {post.authorName}
                </div>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#7C3AED] group-hover:via-[#EC4899] group-hover:to-[#06B6D4] transition-all duration-500 leading-[1.1]">
              {post.title}
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed text-lg line-clamp-2 mb-8">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-[#7C3AED] font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
              Read Article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Post Card
/* ------------------------------------------------------------------ */
function PostCard({
  post,
  formatDate,
  index,
}: {
  post: BlogPost;
  formatDate: (d: string | null) => string;
  index: number;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 6) * 0.08, duration: 0.5 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="relative rounded-[2rem] overflow-hidden h-full flex flex-col"
      >
        {/* Hover gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/0 via-[#EC4899]/0 to-[#06B6D4]/0 group-hover:from-[#7C3AED] group-hover:via-[#EC4899] group-hover:to-[#06B6D4] opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-[2rem]" />

        <div className="relative bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl h-full flex flex-col group-hover:border-white/10 transition-all duration-500">
          {/* Cover */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.coverImage || `https://picsum.photos/seed/post-${post.id}/800/500`}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 to-transparent" />

            {/* Tag badge */}
            {post.tags && post.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/30">
                  {post.tags[0]}
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-7 flex-1 flex flex-col">
            {/* Meta */}
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                5 min read
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#7C3AED] group-hover:to-[#EC4899] transition-all duration-300 leading-[1.15] line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-400 font-medium leading-relaxed text-sm line-clamp-3 mb-6 flex-1">
              {post.excerpt}
            </p>

            {/* Author + Read more */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-[#0B0F1A] flex items-center justify-center text-[9px] font-black text-white">
                    {(post.authorName || 'L')[0]}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 truncate max-w-[100px]">
                  {post.authorName || 'LinkNest Team'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#7C3AED] font-black uppercase tracking-widest text-[9px] group-hover:gap-2 transition-all">
                Read
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Card
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <div className="rounded-[2rem] bg-white/[0.03] border border-white/5 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-white/5" />
      <div className="p-7 space-y-3">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter Card
/* ------------------------------------------------------------------ */
function NewsletterSection({
  newsletterEmail,
  setNewsletterEmail,
  newsletterStatus,
  newsletterMessage,
  handleNewsletterSubmit,
}: {
  newsletterEmail: string;
  setNewsletterEmail: (v: string) => void;
  newsletterStatus: 'idle' | 'loading' | 'success' | 'error';
  newsletterMessage: string;
  handleNewsletterSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-[3rem] overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(6,182,212,0.3) 100%)',
            'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(124,58,237,0.3) 50%, rgba(236,72,153,0.2) 100%)',
            'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(6,182,212,0.3) 50%, rgba(124,58,237,0.3) 100%)',
            'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(6,182,212,0.3) 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[#0B0F1A]/60 backdrop-blur-3xl" />
      <Particles />

      <div className="relative z-10 px-10 py-16 md:px-20 md:py-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#7C3AED]/20 to-[#EC4899]/20 border border-white/10 flex items-center justify-center mx-auto mb-8"
        >
          <Mail className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
          <span className="text-white">Join the </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
            Creator Insider
          </span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          Get the latest creator strategies and LinkNest updates delivered straight to your inbox every week.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-bold shadow-xl"
            />
          </div>
          <button
            type="submit"
            disabled={newsletterStatus === 'loading'}
            className="relative group px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white overflow-hidden disabled:opacity-50 shadow-xl shadow-[#7C3AED]/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {newsletterStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </button>
        </form>

        <AnimatePresence mode="wait">
          {newsletterMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 text-xs font-bold ${newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
            >
              {newsletterMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {!newsletterMessage && (
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            No spam. Just value. Unsubscribe anytime.
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component
/* ------------------------------------------------------------------ */
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const heroRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (tag?: string, search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tag && tag !== 'All') params.set('tag', tag);
      if (search) params.set('search', search);
      params.set('limit', '20');

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/blog?limit=100')
      .then((res) => res.json())
      .then((data) => {
        const allTags = new Set<string>();
        (data.posts || []).forEach((post: BlogPost) => {
          post.tags?.forEach((tag) => allTags.add(tag));
        });
        setCategories(['All', ...Array.from(allTags)]);
      })
      .catch(console.error);

    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6);
    fetchPosts(category, searchQuery || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVisibleCount(6);
    fetchPosts(selectedCategory, searchQuery || undefined);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage('Successfully subscribed!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('Failed to subscribe');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <PageLayout>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* ============================ */}
        {/*  Animated Gradient BG       */}
        {/* ============================ */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0 opacity-30"
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

        <FloatingOrb className="absolute top-20 left-[10%] w-72 h-72 bg-[#7C3AED]/15 rounded-full blur-[100px]" delay={0} />
        <FloatingOrb className="absolute bottom-20 right-[10%] w-96 h-96 bg-[#EC4899]/10 rounded-full blur-[120px]" delay={2} />
        <Particles />

        {/* ============================ */}
        {/*  Hero Section               */}
        {/* ============================ */}
        <section ref={heroRef} className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl"
            >
              <Zap className="w-3.5 h-3.5" />
              Blog & Resources
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
            >
              <span className="text-white">Blog & </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4]">
                Resources.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12"
            >
              The latest tips, strategies, and industry news to help you build your digital empire and connect with your audience.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              <div className="relative flex items-center">
                <Search className="absolute left-6 w-6 h-6 text-slate-500 group-hover:text-[#7C3AED] group-focus-within:text-[#7C3AED] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-bold text-lg shadow-2xl"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      fetchPosts(selectedCategory, undefined);
                    }}
                    className="absolute right-6 p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                )}
              </div>
            </motion.form>
          </div>
        </section>

        {/* ============================ */}
        {/*  Tag Filter                 */}
        {/* ============================ */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${cat === selectedCategory
                    ? 'text-white border-transparent shadow-lg shadow-[#7C3AED]/20'
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                >
                  {cat === selectedCategory && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] rounded-full" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================ */}
        {/*  Featured Post              */}
        {/* ============================ */}
        {!loading && featuredPost && (
          <section className="py-10 px-6">
            <div className="max-w-6xl mx-auto">
              <FeaturedPost post={featuredPost} formatDate={formatDate} />
            </div>
          </section>
        )}

        {/* ============================ */}
        {/*  Post Grid                  */}
        {/* ============================ */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : gridPosts.length === 0 ? (
              <div className="text-center py-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 mb-8"
                >
                  <Search className="w-8 h-8 text-slate-600" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No articles found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visiblePosts.slice(1).map((post, i) => (
                  <PostCard key={post.id} post={post} formatDate={formatDate} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================ */}
        {/*  Load More                  */}
        {/* ============================ */}
        {!loading && hasMore && (
          <section className="py-12 px-6 text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setVisibleCount((prev) => prev + 6)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white overflow-hidden shadow-xl shadow-[#7C3AED]/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] transition-all duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] via-[#EC4899] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                Load More
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </section>
        )}

        {/* ============================ */}
        {/*  Newsletter                 */}
        {/* ============================ */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <NewsletterSection
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              newsletterStatus={newsletterStatus}
              newsletterMessage={newsletterMessage}
              handleNewsletterSubmit={handleNewsletterSubmit}
            />
          </div>
        </section>

        {/* Spacer */}
        <div className="h-20" />
      </div>
    </PageLayout>
  );
}
