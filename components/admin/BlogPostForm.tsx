'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Check, Loader2, Eye, EyeOff, Save, Send
} from 'lucide-react';

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

interface BlogPostFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editingPost: any | null;
}

const emptyForm: BlogPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  published: false,
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BlogPostForm({ open, onClose, onSave, editingPost }: BlogPostFormProps) {
  const [form, setForm] = useState<BlogPostFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setForm({
        title: editingPost.title || '',
        slug: editingPost.slug || '',
        excerpt: editingPost.excerpt || '',
        content: editingPost.content || '',
        coverImage: editingPost.coverImage || '',
        tags: Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : '',
        seoTitle: editingPost.seoTitle || '',
        seoDescription: editingPost.seoDescription || '',
        published: editingPost.published || false,
      });
      setAutoSlug(false);
    } else {
      setForm(emptyForm);
      setAutoSlug(true);
    }
  }, [editingPost, open]);

  const handleTitleChange = useCallback((title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      ...(autoSlug ? { slug: generateSlug(title) } : {}),
    }));
  }, [autoSlug]);

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.content) return;
    setSaving(true);

    const tagsArray = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || null,
      tags: tagsArray,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      published: form.published,
      ...(form.published && !editingPost?.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
    };

    try {
      await onSave(payload);
    } catch (error) {
      console.error('Save post error:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderMarkdownPreview = (content: string) => {
    return content
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-black text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-brand-primary font-mono text-sm">$1</code>')
      .replace(/^\> (.+)$/gm, '<blockquote class="border-l-2 border-brand-primary pl-4 py-2 my-4 text-slate-400 italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300 before:content-["•"] before:mr-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 my-2 leading-relaxed">')
      .replace(/\n/g, '<br />');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="premium-card-gloss w-full max-w-3xl rounded-[2.5rem] overflow-hidden my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <h3 className="text-xl font-black text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  title={previewMode ? 'Edit mode' : 'Preview mode'}
                >
                  {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {previewMode ? (
                <div className="space-y-6">
                  {form.coverImage && (
                    <img
                      src={form.coverImage}
                      alt={form.title}
                      className="w-full h-48 object-cover rounded-2xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <h1 className="text-3xl font-black text-white">{form.title}</h1>
                  {form.excerpt && (
                    <p className="text-lg text-slate-400 italic">{form.excerpt}</p>
                  )}
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(form.content) }}
                  />
                  {form.tags && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {form.tags.split(',').map((tag, i) => (
                        tag.trim() && (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold"
                          >
                            {tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 text-lg font-bold"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Slug * {autoSlug && <span className="text-slate-600 normal-case tracking-normal">(auto-generated from title)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => {
                          setForm({ ...form, slug: e.target.value });
                          setAutoSlug(false);
                        }}
                        placeholder="post-url-slug"
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          setForm({ ...form, slug: generateSlug(form.title) });
                          setAutoSlug(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-white/5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      placeholder="Brief summary of the post..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 resize-none"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Content * <span className="text-slate-600 normal-case tracking-normal">(supports markdown)</span>
                    </label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="# Heading\n\n**Bold text** and *italic text*\n\n- List item\n\n> Blockquote"
                      rows={12}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 font-mono text-sm resize-y leading-relaxed"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50"
                    />
                    {form.coverImage && (
                      <img
                        src={form.coverImage}
                        alt="Cover preview"
                        className="mt-3 w-full h-32 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Tags <span className="text-slate-600 normal-case tracking-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="nextjs, react, tutorial"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50"
                    />
                    {form.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.tags.split(',').map((tag, i) => (
                          tag.trim() && (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold"
                            >
                              {tag.trim()}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SEO Section */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-5">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">SEO Settings</h4>

                    {/* SEO Title */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={form.seoTitle}
                        onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                        placeholder="Optimized title for search engines"
                        maxLength={60}
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50"
                      />
                      <div className="text-right text-[10px] text-slate-600 mt-1">{form.seoTitle.length}/60</div>
                    </div>

                    {/* SEO Description */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        SEO Description
                      </label>
                      <textarea
                        value={form.seoDescription}
                        onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                        placeholder="Meta description for search engines..."
                        rows={3}
                        maxLength={160}
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 resize-none"
                      />
                      <div className="text-right text-[10px] text-slate-600 mt-1">{form.seoDescription.length}/160</div>
                    </div>
                  </div>

                  {/* Published Toggle */}
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5">
                    <div>
                      <div className="text-sm font-black text-white">Published</div>
                      <div className="text-xs text-slate-500">Make this post visible to the public</div>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, published: !form.published })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        form.published ? 'bg-green-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                          form.published ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-white/5 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.title || !form.slug || !form.content}
                className="flex-1 py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : form.published ? (
                  <>
                    <Send className="w-5 h-5" />
                    {editingPost ? 'Update & Publish' : 'Publish Post'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingPost ? 'Update Draft' : 'Save Draft'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
