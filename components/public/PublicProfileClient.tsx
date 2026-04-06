'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Share2,
  ExternalLink,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import PasswordPromptModal from './PasswordPromptModal';
import { ImageBlock, VideoBlock, TextBlock } from './blocks';

const LinkCard = ({ title, url, icon: Icon, type = 'link', featured = false, buttonStyle = 'Rounded', onClick }: { title: string, url: string, icon?: any, type?: string, featured?: boolean, buttonStyle?: string, onClick?: () => void }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    viewport={{ once: true }}
    className={`w-full p-4 flex items-center gap-4 transition-all duration-300 relative group overflow-hidden ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-2xl'
      } ${featured
        ? 'bg-white text-black shadow-xl shadow-white/10'
        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
      }`}
  >
    {featured && (
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
    )}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${featured ? 'bg-black/5' : 'bg-white/5'
      }`}>
      {Icon ? <Icon className="w-6 h-6" /> : <ExternalLink className="w-5 h-5 opacity-50" />}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold truncate">{title}</h3>
      <p className={`text-xs truncate ${featured ? 'text-black/60' : 'text-slate-500'}`}>{url.replace('https://', '')}</p>
    </div>
    <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${featured ? 'text-black/40' : 'text-white/40'}`}>
      <ExternalLink className="w-4 h-4" />
    </div>
  </motion.a>
);

const LockedLinkCard = ({ title, featured = false, buttonStyle = 'Rounded', onClick }: { title: string, featured?: boolean, buttonStyle?: string, onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    viewport={{ once: true }}
    className={`w-full p-4 flex items-center gap-4 transition-all duration-300 relative group overflow-hidden cursor-pointer ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-2xl'
      } ${featured
        ? 'bg-white/90 text-black shadow-xl shadow-white/10'
        : 'bg-white/5 border border-violet-500/20 text-white hover:bg-violet-500/10 hover:border-violet-500/40'
      }`}
  >
    {featured && (
      <div className="absolute top-0 left-0 w-1 h-full bg-violet-400" />
    )}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${featured ? 'bg-black/5' : 'bg-violet-500/10'
      }`}>
      <Lock className={`w-5 h-5 ${featured ? 'text-black/40' : 'text-violet-400'}`} />
    </div>
    <div className="flex-1 min-w-0 text-left">
      <h3 className="font-bold truncate">{title}</h3>
      <p className={`text-xs truncate ${featured ? 'text-black/60' : 'text-slate-500'}`}>Password protected</p>
    </div>
    <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${featured ? 'text-black/40' : 'text-violet-400'}`}>
      <Lock className="w-4 h-4" />
    </div>
  </motion.button>
);

export default function PublicProfileClient({ profile, links }: { profile: any, links: any[] }) {
  const [unlockedLinks, setUnlockedLinks] = useState<Set<number>>(new Set());
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; link: any | null }>({ open: false, link: null });

  useEffect(() => {
    // Track view on mount
    trackEvent('view', profile.userId);

    // Restore unlocked links from sessionStorage
    const unlocked = new Set<number>();
    links.forEach((link: any) => {
      if (sessionStorage.getItem(`unlocked_link_${link.id}`) === 'true') {
        unlocked.add(link.id);
      }
    });
    setUnlockedLinks(unlocked);
  }, [profile.userId]);

  const handleLockedLinkClick = (link: any) => {
    setPasswordModal({ open: true, link });
  };

  const handleUnlock = (linkId: number) => {
    setUnlockedLinks(prev => new Set(prev).add(linkId));
    setPasswordModal({ open: false, link: null });
  };

  const handleLinkClick = (link: any) => {
    // If link has password and is not unlocked, show password modal
    if (link.password && !unlockedLinks.has(link.id)) {
      handleLockedLinkClick(link);
      return false;
    }
    trackEvent('click', profile.userId, link.id);
    return true;
  };

  const trackEvent = async (eventType: 'view' | 'click', userId: number, linkId?: number) => {
    try {
      await fetch('/api/public/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          linkId,
          eventType,
          device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
          referrer: document.referrer || 'direct',
        }),
      });
    } catch (err) {
      console.error('Tracking failed:', err);
    }
  };

  useEffect(() => {
    // Track view on mount
    trackEvent('view', profile.userId);
  }, [profile.userId]);

  return (
    <div className="min-h-screen text-white relative flex flex-col items-center py-20 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-700"
        style={{
          background: profile?.theme === 'Custom'
            ? `linear-gradient(${profile.gradientDirection || 'to bottom right'}, ${profile.gradientColor1 || '#0a0a0a'}, ${profile.gradientColor2 || '#121212'})`
            : profile?.theme === 'Ocean Breeze' ? 'linear-gradient(to bottom, #0ea5e9, #14b8a6)'
              : profile?.theme === 'Sunset Glow' ? 'linear-gradient(to bottom, #f59e0b, #ef4444)'
                : profile?.theme === 'Forest Deep' ? 'linear-gradient(to bottom, #064e3b, #065f46)'
                  : profile?.theme === 'Royal Velvet' ? 'linear-gradient(to bottom, #4c1d95, #5b21b6)'
                    : profile?.theme === 'Cyber Neon' ? 'linear-gradient(to bottom, #000000, #111111)'
                      : 'linear-gradient(to bottom, #0a0a0a, #121212)' // Minimal Dark default
        }}
      />

      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none -z-10" />

      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent shadow-2xl glass-gloss">
            <div className="w-full h-full rounded-[2.2rem] bg-surface-950 overflow-hidden border-4 border-surface-950 relative">
              <Image
                src={profile.avatar || 'https://picsum.photos/seed/creator/200/200'}
                alt={profile.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl border-4 border-surface-950"
          >
            <CheckCircle2 className="text-white w-5 h-5 fill-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-black mb-3 tracking-tight">{profile.name}</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto font-medium">
            {profile.bio || 'Welcome to my profile!'}
          </p>
        </motion.div>

        {/* Links List */}
        <div className="w-full space-y-4 mb-20">
          {links.map((link: any, i: number) => {
            const isLocked = link.password && !unlockedLinks.has(link.id);
            const blockType = link.type || 'link';

            if (isLocked) {
              return (
                <LockedLinkCard
                  key={link.id}
                  title={link.title}
                  featured={link.position > 0}
                  buttonStyle={profile.buttonStyle}
                  onClick={() => handleLockedLinkClick(link)}
                />
              );
            }

            const handleClick = () => {
              if (link.password && unlockedLinks.has(link.id)) {
                trackEvent('click', profile.userId, link.id);
              } else if (!link.password) {
                trackEvent('click', profile.userId, link.id);
              }
            };

            // Render different block types
            if (blockType === 'image') {
              return (
                <ImageBlock
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  imageUrl={link.description || undefined}
                  featured={link.position > 0}
                  buttonStyle={profile.buttonStyle}
                  onClick={handleClick}
                />
              );
            }

            if (blockType === 'video') {
              return (
                <VideoBlock
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  featured={link.position > 0}
                  buttonStyle={profile.buttonStyle}
                  onClick={handleClick}
                />
              );
            }

            if (blockType === 'text') {
              return (
                <TextBlock
                  key={link.id}
                  title={link.title}
                  content={link.description || link.title}
                  url={link.url || undefined}
                  featured={link.position > 0}
                  buttonStyle={profile.buttonStyle}
                  onClick={handleClick}
                />
              );
            }

            // Default: render as link
            return (
              <LinkCard
                key={link.id}
                title={link.title}
                url={link.url}
                featured={link.position > 0}
                buttonStyle={profile.buttonStyle}
                onClick={handleClick}
              />
            );
          })}
        </div>

        {/* Password Prompt Modal */}
        {passwordModal.link && (
          <PasswordPromptModal
            linkTitle={passwordModal.link.title}
            linkId={passwordModal.link.id}
            isOpen={passwordModal.open}
            onClose={() => setPasswordModal({ open: false, link: null })}
            onUnlock={handleUnlock}
          />
        )}

        {/* Footer Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-auto flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-brand-primary text-brand-primary" />
            Built with LinkNest
          </div>
          <div className="flex gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Report</Link>
            <span className="opacity-20">|</span>
            <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Share Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl z-50 hover:bg-slate-100 transition-colors"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: profile.name,
              text: profile.bio,
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }
        }}
      >
        <Share2 className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
