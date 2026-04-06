'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import {
  ExternalLink,
  Zap,
  CheckCircle2,
  Smartphone,
  Image as ImageIcon,
  Video,
  Type
} from 'lucide-react';

interface ProfilePreviewProps {
  profile: any;
  links: any[];
}

export const ProfilePreview = ({ profile, links }: ProfilePreviewProps) => {
  const visibleLinks = links.filter(link => link.visible);

  return (
    <div className="sticky top-32 flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center justify-center gap-2">
          <Smartphone className="w-3 h-3" /> Live Preview
        </h3>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Updates in real-time</p>
      </div>

      {/* Phone Mockup */}
      <div className="relative w-[300px] h-[600px] bg-surface-950 rounded-[3rem] border-[8px] border-surface-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface-900 rounded-b-2xl z-20" />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 flex flex-col items-center">
          {/* Dynamic Background */}
          <div
            className="absolute inset-0 -z-10 transition-all duration-700"
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
          <div className="absolute inset-0 bg-black/20 pointer-events-none -z-10" />

          {/* Profile Header */}
          <div className="mt-8 mb-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-[1.5rem] p-0.5 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent shadow-xl">
                <div className="w-full h-full rounded-[1.3rem] bg-surface-950 overflow-hidden border-2 border-surface-950 relative">
                  <Image
                    src={profile?.avatar || 'https://picsum.photos/seed/creator/200/200'}
                    alt={profile?.name || 'User'}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg border-2 border-surface-950">
                <CheckCircle2 className="text-white w-3 h-3 fill-white" />
              </div>
            </div>
            <h1 className="text-lg font-black text-white mb-1 tracking-tight">{profile?.name || 'Your Name'}</h1>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[180px] font-medium">
              {profile?.bio || 'Write something about yourself...'}
            </p>
          </div>

          {/* Links List */}
          <div className="w-full space-y-3 mb-10">
            {visibleLinks.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No visible links</p>
              </div>
            ) : (
              visibleLinks.map((link) => {
                const linkType = link.type || 'link';
                return (
                  <div
                    key={link.id}
                    className={`w-full p-3 flex items-center gap-3 transition-all duration-300 relative overflow-hidden ${profile?.buttonStyle === 'Sharp' ? 'rounded-none' : profile?.buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-xl'
                      } ${link.position > 0
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/5 border border-white/10 text-white'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${link.position > 0 ? 'bg-black/5' : 'bg-white/5'
                      }`}>
                      {linkType === 'image' && <ImageIcon className="w-4 h-4" />}
                      {linkType === 'video' && <Video className="w-4 h-4" />}
                      {linkType === 'text' && <Type className="w-4 h-4" />}
                      {(!linkType || linkType === 'link') && <ExternalLink className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold truncate">{link.title}</h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[8px] font-black uppercase tracking-widest">
              <Zap className="w-2 h-2 fill-brand-primary text-brand-primary" />
              Built with LinkNest
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
