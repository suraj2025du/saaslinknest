'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  QrCode,
  ExternalLink,
  BarChart2,
  X,
  Loader2,
  Smartphone,
  Copy,
  Check,
  Calendar,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  Type,
  Link as LinkIcon
} from 'lucide-react';
import { ProfilePreview } from './ProfilePreview';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Convert ISO date to local datetime-local input format (YYYY-MM-DDTHH:mm)
function toLocalInput(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

// Format a date for display
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface LinkType {
  id: number;
  title: string;
  url: string;
  visible: boolean;
  position: number;
  clicks: number;
  scheduledAt: string | null;
  scheduledEndAt: string | null;
  scheduleStatus: 'active' | 'scheduled' | 'expired' | null;
  password: string | null;
  type?: 'link' | 'image' | 'video' | 'text';
}

const SortableLink = ({
  link,
  index,
  toggleVisibility,
  deleteLink,
  generateQR,
  toggleSchedule,
  togglePassword,
}: {
  link: LinkType;
  index: number;
  toggleVisibility: (id: number, currentVisible: boolean) => void;
  deleteLink: (id: number) => void;
  generateQR: (url: string) => void;
  toggleSchedule: (link: LinkType) => void;
  togglePassword: (link: LinkType) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="premium-card-gloss p-5 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-400 transition-colors p-2"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center text-brand-primary shadow-inner">
          {link.type === 'image' && <ImageIcon className="w-6 h-6" />}
          {link.type === 'video' && <Video className="w-6 h-6" />}
          {link.type === 'text' && <Type className="w-6 h-6" />}
          {(!link.type || link.type === 'link') && <ExternalLink className="w-6 h-6" />}
        </div>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-black text-lg text-white truncate group-hover:text-brand-primary transition-colors">{link.title}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {link.type === 'image' && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Image
              </span>
            )}
            {link.type === 'video' && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <Video className="w-3 h-3" />
                Video
              </span>
            )}
            {link.type === 'text' && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Type className="w-3 h-3" />
                Text
              </span>
            )}
            {link.password && (
              <span className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-[10px] font-black uppercase tracking-widest text-violet-400 border border-violet-500/20 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Protected
              </span>
            )}
            {link.scheduleStatus === 'scheduled' && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-[10px] font-black uppercase tracking-widest text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Scheduled
              </span>
            )}
            {link.scheduleStatus === 'active' && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Active
              </span>
            )}
            {link.scheduleStatus === 'expired' && (
              <span className="px-2 py-0.5 rounded-lg bg-slate-500/10 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Expired
              </span>
            )}
            {!link.visible && !link.scheduledAt && (
              <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
                Hidden
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-500 truncate font-medium">{link.url}</p>
        {link.scheduledAt && (
          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            {formatDate(link.scheduledAt)}
            {link.scheduledEndAt ? ` — ${formatDate(link.scheduledEndAt)}` : ' — indefinitely'}
          </p>
        )}
      </div>

      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
        <div className="flex flex-col items-center md:items-end">
          <div className="text-xl font-black text-white tabular-nums">{(link.clicks || 0).toLocaleString()}</div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <BarChart2 className="w-3 h-3" /> Clicks
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => togglePassword(link)}
            className={`p-3 rounded-xl hover:bg-white/5 transition-all active:scale-90 ${link.password ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10' : 'text-slate-500 hover:text-white'
              }`}
            title={link.password ? 'Remove password' : 'Add password'}
          >
            {link.password ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>
          <button
            onClick={() => toggleSchedule(link)}
            className="p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
            title="Schedule"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => generateQR(link.url)}
            className="p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
            title="QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleVisibility(link.id, link.visible)}
            className="p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
            title={link.visible ? 'Hide' : 'Show'}
          >
            {link.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => deleteLink(link.id)}
            className="p-3 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all active:scale-90"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const LinksModule = ({ user }: { user: any }) => {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'link' as 'link' | 'image' | 'video' | 'text', scheduledAt: '', scheduledEndAt: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // AI Suggestions State
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; link: LinkType | null }>({ open: false, link: null });
  const [scheduleForm, setScheduleForm] = useState({ scheduledAt: '', scheduledEndAt: '' });
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; link: LinkType | null }>({ open: false, link: null });
  const [passwordForm, setPasswordForm] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLinks(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      try {
        await fetch('/api/links/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newLinks.map((l) => l.id) }),
        });
      } catch (error) {
        console.error('Failed to save order:', error);
      }
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: newLink.title,
        url: newLink.url,
        type: newLink.type,
      };
      if (newLink.description) {
        payload.description = newLink.description;
      }
      if (newLink.scheduledAt) {
        payload.scheduledAt = new Date(newLink.scheduledAt).toISOString();
      }
      if (newLink.scheduledEndAt) {
        payload.scheduledEndAt = new Date(newLink.scheduledEndAt).toISOString();
      }

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewLink({ title: '', url: '', type: 'link', scheduledAt: '', scheduledEndAt: '', description: '' });
        setIsAdding(false);
        fetchLinks();
      }
    } catch (error) {
      console.error('Failed to add link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (id: number, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      });
      if (res.ok) {
        setLinks(links.map(l => l.id === id ? { ...l, visible: !currentVisible } : l));
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const deleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLinks(links.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const generateQR = async (url: string) => {
    try {
      const res = await fetch('/api/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: url }),
      });
      const data = await res.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('QR code generation error:', error);
    }
  };

  const openScheduleModal = (link: LinkType) => {
    setScheduleForm({
      scheduledAt: toLocalInput(link.scheduledAt),
      scheduledEndAt: toLocalInput(link.scheduledEndAt),
    });
    setScheduleError(null);
    setScheduleModal({ open: true, link });
  };

  const saveSchedule = async () => {
    if (!scheduleModal.link) return;
    setIsSavingSchedule(true);
    setScheduleError(null);

    try {
      const payload: any = {};
      if (scheduleForm.scheduledAt) {
        payload.scheduledAt = new Date(scheduleForm.scheduledAt).toISOString();
      } else {
        payload.scheduledAt = null;
        payload.scheduledEndAt = null;
      }
      if (scheduleForm.scheduledEndAt) {
        payload.scheduledEndAt = new Date(scheduleForm.scheduledEndAt).toISOString();
      } else if (scheduleForm.scheduledAt) {
        payload.scheduledEndAt = null;
      }

      const res = await fetch(`/api/links/${scheduleModal.link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setScheduleModal({ open: false, link: null });
        fetchLinks();
      } else {
        const data = await res.json();
        setScheduleError(data.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setScheduleError('Failed to save schedule');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const openPasswordModal = (link: LinkType) => {
    if (link.password) {
      // If already has password, remove it immediately
      removePassword(link.id);
    } else {
      setPasswordForm('');
      setPasswordError(null);
      setPasswordModal({ open: true, link });
    }
  };

  const removePassword = async (id: number) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: null }),
      });
      if (res.ok) {
        setLinks(links.map(l => l.id === id ? { ...l, password: null } : l));
      }
    } catch (error) {
      console.error('Failed to remove password:', error);
    }
  };

  const savePassword = async () => {
    if (!passwordModal.link) return;
    if (!passwordForm || passwordForm.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }
    setIsSavingPassword(true);
    setPasswordError(null);

    try {
      const res = await fetch(`/api/links/${passwordModal.link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm }),
      });

      if (res.ok) {
        setPasswordModal({ open: false, link: null });
        fetchLinks();
      } else {
        const data = await res.json();
        setPasswordError(data.error || 'Failed to set password');
      }
    } catch (error) {
      console.error('Failed to set password:', error);
      setPasswordError('Failed to set password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiSuggestions = async () => {
    if (!user?.profile?.bio) {
      setSuggestionError('Please add a bio in settings first so AI can suggest relevant links.');
      setShowAIModal(true);
      return;
    }

    setIsGeneratingSuggestions(true);
    setSuggestionError('');
    setShowAIModal(true);
    try {
      const res = await fetch('/api/ai/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          bio: user.profile.bio,
          currentLinks: links.map(l => l.title)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get suggestions');
      setSuggestions(data.suggestions);
    } catch (error: any) {
      setSuggestionError(error.message);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const addSuggestedLink = async (suggestion: any) => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          url: suggestion.suggestedUrl
        }),
      });
      if (res.ok) {
        fetchLinks();
        setSuggestions(suggestions.filter(s => s.title !== suggestion.title));
      }
    } catch (error) {
      console.error('Failed to add suggested link:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Links</h2>
          <p className="text-slate-400 text-sm font-medium">Manage and optimize your profile links for conversion.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <Smartphone className="w-5 h-5" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleAiSuggestions}
            className="bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-brand-primary" />
            AI Suggestions
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 group active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Link
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Links Management */}
        <div className={`lg:col-span-7 space-y-8 ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleAddLink} className="premium-card p-6 rounded-[2rem] space-y-4 border-2 border-brand-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-white uppercase tracking-widest text-xs">Create New Link</h3>
                    <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Type Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Block Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 'link', label: 'Link', icon: LinkIcon, color: 'text-brand-primary' },
                        { value: 'image', label: 'Image', icon: ImageIcon, color: 'text-blue-400' },
                        { value: 'video', label: 'Video', icon: Video, color: 'text-rose-400' },
                        { value: 'text', label: 'Text', icon: Type, color: 'text-emerald-400' },
                      ].map((typeOption) => (
                        <button
                          key={typeOption.value}
                          type="button"
                          onClick={() => setNewLink({ ...newLink, type: typeOption.value as any })}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${newLink.type === typeOption.value
                            ? 'border-brand-primary/50 bg-brand-primary/10'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                          <typeOption.icon className={`w-5 h-5 ${newLink.type === typeOption.value ? typeOption.color : 'text-slate-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${newLink.type === typeOption.value ? 'text-white' : 'text-slate-500'
                            }`}>
                            {typeOption.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                      <input
                        type="text"
                        placeholder={
                          newLink.type === 'link' ? 'e.g. My Portfolio' :
                            newLink.type === 'image' ? 'e.g. Product Screenshot' :
                              newLink.type === 'video' ? 'e.g. YouTube Tutorial' :
                                'e.g. Announcement'
                        }
                        value={newLink.title}
                        onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                        className="w-full bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        {newLink.type === 'link' ? 'URL' :
                          newLink.type === 'image' ? 'Image URL' :
                            newLink.type === 'video' ? 'Video URL (YouTube/Vimeo)' :
                              'Optional Link URL'}
                      </label>
                      <input
                        type="url"
                        placeholder={
                          newLink.type === 'link' ? 'https://...' :
                            newLink.type === 'image' ? 'https://example.com/image.jpg' :
                              newLink.type === 'video' ? 'https://youtube.com/watch?v=...' :
                                'https://... (optional)'
                        }
                        value={newLink.url}
                        onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                        className="w-full bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        required={newLink.type !== 'text'}
                      />
                    </div>
                  </div>

                  {/* Description field for text blocks */}
                  {newLink.type === 'text' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Text Content</label>
                      <textarea
                        placeholder="Enter your text content here..."
                        value={newLink.description}
                        onChange={e => setNewLink({ ...newLink, description: e.target.value })}
                        rows={4}
                        className="w-full bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none"
                        required
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {newLink.type === 'image' && newLink.url && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preview</label>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-surface-950 aspect-video flex items-center justify-center">
                        <img
                          src={newLink.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {newLink.type === 'video' && newLink.url && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preview</label>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-surface-950 aspect-video flex items-center justify-center">
                        {(() => {
                          const ytMatch = newLink.url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                          const vimeoMatch = newLink.url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
                          if (ytMatch) {
                            return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}?mute=1`} className="w-full h-full" allow="autoplay" title="Preview" />;
                          }
                          if (vimeoMatch) {
                            return <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} className="w-full h-full" allow="autoplay" title="Preview" />;
                          }
                          return (
                            <div className="flex flex-col items-center gap-2 text-slate-500 p-4">
                              <Video className="w-8 h-8" />
                              <p className="text-xs text-center">Enter a YouTube or Vimeo URL for preview</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Schedule fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Start Date & Time (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={newLink.scheduledAt}
                        onChange={e => setNewLink({ ...newLink, scheduledAt: e.target.value })}
                        className="w-full bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        End Date & Time (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={newLink.scheduledEndAt}
                        onChange={e => setNewLink({ ...newLink, scheduledEndAt: e.target.value })}
                        className="w-full bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      disabled={isSubmitting}
                      className="bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {newLink.type === 'link' ? 'Save Link' :
                        newLink.type === 'image' ? 'Save Image' :
                          newLink.type === 'video' ? 'Save Video' :
                            'Save Text Block'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Loading links...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-20 premium-card rounded-[2.5rem] border-dashed border-2 border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">No links yet</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Start building your profile by adding your first link above.</p>
              </div>
            ) : (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {links.map((link, index) => (
                        <SortableLink
                          key={link.id}
                          link={link}
                          index={index}
                          toggleVisibility={toggleVisibility}
                          deleteLink={deleteLink}
                          generateQR={generateQR}
                          toggleSchedule={openScheduleModal}
                          togglePassword={openPasswordModal}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* QR Code Modal */}
                <AnimatePresence>
                  {qrCode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setQrCode(null)}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface-900 border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full relative"
                      >
                        <button
                          onClick={() => setQrCode(null)}
                          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-black text-white mb-6 text-center">QR Code</h3>
                        <div className="bg-white rounded-2xl p-4 mb-6">
                          <img src={qrCode} alt="QR Code" className="w-full" />
                        </div>

                        <button
                          onClick={() => copyToClipboard(qrCode)}
                          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5 text-green-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy Image
                            </>
                          )}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Schedule Modal */}
                <AnimatePresence>
                  {scheduleModal.open && scheduleModal.link && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setScheduleModal({ open: false, link: null })}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative"
                      >
                        <button
                          onClick={() => setScheduleModal({ open: false, link: null })}
                          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-black text-white mb-1">Schedule Link</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium truncate">{scheduleModal.link.title}</p>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Start Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              value={scheduleForm.scheduledAt}
                              onChange={e => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
                              className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all [color-scheme:dark]"
                            />
                            <p className="text-[11px] text-slate-600 ml-1">Leave empty to remove scheduling</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              End Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              value={scheduleForm.scheduledEndAt}
                              onChange={e => setScheduleForm({ ...scheduleForm, scheduledEndAt: e.target.value })}
                              className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all [color-scheme:dark]"
                            />
                            <p className="text-[11px] text-slate-600 ml-1">Leave empty for no end time</p>
                          </div>

                          {scheduleError && (
                            <p className="text-xs text-red-400 font-medium bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-2.5">{scheduleError}</p>
                          )}
                        </div>

                        <div className="flex gap-3 mt-8">
                          <button
                            onClick={() => setScheduleModal({ open: false, link: null })}
                            className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveSchedule}
                            disabled={isSavingSchedule}
                            className="flex-1 py-3.5 rounded-xl bg-white text-black font-black hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSavingSchedule && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password Protection Modal */}
                <AnimatePresence>
                  {passwordModal.open && passwordModal.link && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setPasswordModal({ open: false, link: null })}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative"
                      >
                        <button
                          onClick={() => setPasswordModal({ open: false, link: null })}
                          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                          <KeyRound className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-black text-white mb-1">Password Protect Link</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium truncate">{passwordModal.link.title}</p>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm}
                              onChange={e => setPasswordForm(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && savePassword()}
                              placeholder="Enter password (min 4 characters)"
                              className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-700"
                              autoFocus
                            />
                            <p className="text-[11px] text-slate-600 ml-1">Visitors will need this password to access the link</p>
                          </div>

                          {passwordError && (
                            <p className="text-xs text-red-400 font-medium bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-2.5">{passwordError}</p>
                          )}
                        </div>

                        <div className="flex gap-3 mt-8">
                          <button
                            onClick={() => setPasswordModal({ open: false, link: null })}
                            className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={savePassword}
                            disabled={isSavingPassword}
                            className="flex-1 py-3.5 rounded-xl bg-violet-500 text-white font-black hover:bg-violet-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSavingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                            Set Password
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Empty State Hint */}
          {links.length > 0 && (
            <div className="text-center py-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">
                Tip: Featured links get 2x more clicks
              </p>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className={`lg:col-span-5 ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <ProfilePreview profile={user.profile} links={links} />
        </div>
      </div>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAIModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-900 border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowAIModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-black text-white">AI Suggestions</h3>
              </div>

              {suggestionError ? (
                <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-center space-y-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {suggestionError}
                  </p>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="w-full py-3 rounded-xl bg-white/5 text-white text-xs font-black uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              ) : isGeneratingSuggestions ? (
                <div className="py-20 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin mx-auto" />
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Analyzing your profile...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium mb-4 uppercase tracking-widest">Based on your bio, we suggest adding:</p>
                  <div className="space-y-3">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-brand-primary/30 transition-all">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-sm font-black text-white truncate">{s.title}</div>
                          <div className="text-[10px] text-slate-500 truncate font-mono">{s.suggestedUrl}</div>
                        </div>
                        <button
                          onClick={() => addSuggestedLink(s)}
                          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                  {suggestions.length === 0 && (
                    <div className="text-center py-10">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <p className="text-sm text-white font-black">All looks good!</p>
                      <p className="text-xs text-slate-500 mt-2">You've added all our suggestions.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
