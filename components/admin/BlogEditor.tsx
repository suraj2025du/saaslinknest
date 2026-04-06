'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Plus, Edit2, Trash2, Search, Loader2,
  Eye, EyeOff, Calendar, Tag
} from 'lucide-react';
import BlogPostForm from './BlogPostForm';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  tags: string[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingAll, setDeletingAll] = useState<Set<number>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 300);
    return () => clearTimeout(timer);
  }, [search, fetchPosts]);

  const openCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    if (editingPost) {
      await fetch(`/api/blog?id=${editingPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    setDeletingId(id);
    setDeletingAll((prev) => new Set(prev).add(id));
    await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
    setDeletingId(null);
    setDeletingAll((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    fetchPosts();
  };

  const togglePublished = async (post: BlogPost) => {
    const newPublished = !post.published;
    await fetch(`/api/blog?id=${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        published: newPublished,
        ...(newPublished && !post.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
      }),
    });
    fetchPosts();
  };

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === 'published') return post.published;
    if (statusFilter === 'draft') return !post.published;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Blog Editor</h2>
          <p className="text-slate-400 text-sm font-medium">{posts.length} total posts</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white font-black text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 w-full"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'published', label: 'Published' },
            { key: 'draft', label: 'Drafts' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                statusFilter === filter.key
                  ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      ) : (
        <div className="premium-card rounded-[2.5rem] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-6">Title</th>
                <th className="p-6">Tags</th>
                <th className="p-6">Status</th>
                <th className="p-6">Date</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredPosts.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-bold text-white">{post.title}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-[10px] font-bold"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-[10px] text-slate-500 font-bold">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-6">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          post.published
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-2 rounded-xl hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingAll.has(post.id)}
                          className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingAll.has(post.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              {search || statusFilter !== 'all'
                ? 'No posts match your filters'
                : 'No blog posts yet. Create one to get started.'}
            </div>
          )}
        </div>
      )}

      {/* Blog Post Form Modal */}
      <BlogPostForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        onSave={handleSave}
        editingPost={editingPost}
      />
    </div>
  );
}
