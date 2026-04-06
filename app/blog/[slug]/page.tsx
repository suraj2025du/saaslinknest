'use client';

import { PageLayout } from '@/components/public/PageLayout';
import { motion } from 'motion/react';
import { Zap, ArrowLeft, Calendar, User, Tag, Share2, Twitter, Instagram, Github, Globe, BarChart3, Palette, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface BlogPostDetail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorName: string | null;
  publishedAt: string | null;
  tags: string[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          setError('Post not found');
          setPost(null);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        setPost(data.post);
      } catch {
        setError('Failed to load the article');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-6" />
            <p className="text-slate-400 font-medium">Loading article...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <div className="pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
            <h1 className="text-5xl font-black text-white mb-8">Article Not Found</h1>
            <p className="text-slate-400 text-xl mb-12">{error || 'The article you are looking for does not exist.'}</p>
            <Link href="/blog" className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all">
              Browse All Articles
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Render content with basic formatting
  const renderContent = (content: string) => {
    // Split by double newlines to get paragraphs
    const paragraphs = content.split(/\n\n+/);
    return paragraphs.map((para, i) => {
      // Check for headings
      if (para.startsWith('# ')) {
        return <h1 key={i} className="text-4xl font-black text-white mt-16 mb-8 tracking-tight">{para.replace('# ', '')}</h1>;
      }
      if (para.startsWith('## ')) {
        return <h2 key={i} className="text-3xl font-black text-white mt-16 mb-8 tracking-tight">{para.replace('## ', '')}</h2>;
      }
      if (para.startsWith('### ')) {
        return <h3 key={i} className="text-2xl font-black text-white mt-12 mb-6 tracking-tight">{para.replace('### ', '')}</h3>;
      }
      // Check for bullet points
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split(/\n/).filter(line => line.startsWith('- ') || line.startsWith('* '));
        return (
          <ul key={i} className="list-disc list-inside space-y-2 text-slate-400 font-medium leading-relaxed mb-8 ml-4">
            {items.map((item, j) => (
              <li key={j}>{item.replace(/^[-*] /, '')}</li>
            ))}
          </ul>
        );
      }
      // Check for numbered lists
      if (/^\d+\./.test(para)) {
        const items = para.split(/\n/).filter(line => /^\d+\./.test(line));
        return (
          <ol key={i} className="list-decimal list-inside space-y-2 text-slate-400 font-medium leading-relaxed mb-8 ml-4">
            {items.map((item, j) => (
              <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        );
      }
      // Default paragraph
      if (para.trim()) {
        return <p key={i} className="text-slate-400 font-medium leading-relaxed mb-8">{para.trim()}</p>;
      }
      return null;
    });
  };

  return (
    <PageLayout>
      {/* Article Header */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {post.tags && post.tags.length > 0 && (
              <div className="px-4 py-2 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                {post.tags[0]}
              </div>
            )}
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </div>
              {post.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {post.authorName}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-[0.9] text-white">
            {post.title}
          </h1>

          {post.coverImage && (
            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-20">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-40 px-6">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_280px] gap-20">
          {/* Main Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.excerpt && (
              <p className="text-xl text-slate-300 font-medium leading-relaxed mb-10">
                {post.excerpt}
              </p>
            )}

            {renderContent(post.content)}

            {/* Author Bio */}
            {post.authorName && (
              <>
                <div className="h-px bg-white/5 my-20" />
                <div className="flex items-center gap-8 p-10 rounded-[2.5rem] bg-white/5 border border-white/10">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden relative border-4 border-surface-950 shadow-2xl">
                    <Image src={`https://picsum.photos/seed/${post.authorName}/200/200`} alt={post.authorName} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white mb-1 tracking-tight">{post.authorName}</h4>
                    <p className="text-sm text-slate-500 font-bold mb-4 uppercase tracking-widest">LinkNest Contributor</p>
                    <div className="flex items-center gap-4">
                      <Twitter className="w-4 h-4 text-slate-600 hover:text-white transition-colors cursor-pointer" />
                      <Globe className="w-4 h-4 text-slate-600 hover:text-white transition-colors cursor-pointer" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div className="premium-card p-8 rounded-[2.5rem] border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Share Article</h4>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={handleShare}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="premium-card p-8 rounded-[2.5rem] border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="premium-card p-8 rounded-[2.5rem] border-brand-primary/20 bg-brand-primary/5">
              <h4 className="text-lg font-black text-white mb-4 tracking-tight">Start Building</h4>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">Ready to put these strategies into practice? Create your LinkNest profile today.</p>
              <Link href="/signup" className="w-full py-4 rounded-2xl bg-brand-primary text-white text-xs font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2">
                Join Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      <RelatedPostsSection currentPostId={post.id} currentTags={post.tags} />
    </PageLayout>
  );
}

// Related posts client component
function RelatedPostsSection({ currentPostId, currentTags }: { currentPostId: number; currentTags: string[] | null }) {
  const [relatedPosts, setRelatedPosts] = useState<Array<{ id: number; slug: string; title: string; coverImage: string | null; tags: string[] | null }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        // Fetch all posts and filter client-side for related ones
        const res = await fetch('/api/blog?limit=50');
        const data = await res.json();
        const allPosts = data.posts || [];

        // Find posts with matching tags, excluding current post
        const related = allPosts
          .filter((p: any) => p.id !== currentPostId)
          .filter((p: any) => {
            if (!currentTags || !p.tags) return false;
            return p.tags.some((tag: string) => currentTags.includes(tag));
          })
          .slice(0, 3);

        setRelatedPosts(related);
      } catch {
        console.error('Failed to fetch related posts');
      } finally {
        setLoading(false);
      }
    };

    if (currentTags && currentTags.length > 0) {
      fetchRelated();
    } else {
      setLoading(false);
    }
  }, [currentPostId, currentTags]);

  if (loading || relatedPosts.length === 0) return null;

  return (
    <section className="py-40 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-white mb-16 tracking-tighter">Related Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {relatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 border border-white/5 group-hover:border-brand-primary/20 transition-all">
                <Image
                  src={post.coverImage || `https://picsum.photos/seed/blog-${post.id}/800/600`}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-3">{post.tags[0]}</div>
              )}
              <h4 className="text-xl font-black text-white tracking-tight group-hover:text-brand-primary transition-colors leading-tight">{post.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
