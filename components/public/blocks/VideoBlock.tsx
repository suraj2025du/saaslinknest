'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink, AlertTriangle } from 'lucide-react';

interface VideoBlockProps {
  title: string;
  url: string;
  featured?: boolean;
  buttonStyle?: string;
  onClick?: () => void;
}

function getVideoEmbedInfo(url: string): { embedUrl: string | null; provider: string | null } {
  if (!url) return { embedUrl: null, provider: null };

  // YouTube patterns
  const youtubeMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`,
      provider: 'youtube',
    };
  }

  // Vimeo patterns
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
      provider: 'vimeo',
    };
  }

  return { embedUrl: null, provider: null };
}

export default function VideoBlock({
  title,
  url,
  featured = false,
  buttonStyle = 'Rounded',
  onClick,
}: VideoBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { embedUrl, provider } = getVideoEmbedInfo(url);
  const canEmbed = !!embedUrl;

  // Reset playing state when URL changes
  useEffect(() => {
    setIsPlaying(false);
    setEmbedError(false);
  }, [url]);

  const handlePlay = () => {
    if (canEmbed) {
      setIsPlaying(true);
    } else {
      // Fallback: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      className={`w-full premium-card-gloss overflow-hidden transition-all duration-300 group relative ${
        buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-2xl'
      } ${featured ? 'ring-2 ring-brand-primary/50 shadow-xl shadow-brand-primary/10' : ''}`}
    >
      {featured && (
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary z-10" />
      )}

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-surface-950 overflow-hidden">
        {isPlaying && canEmbed ? (
          <iframe
            ref={iframeRef}
            src={embedUrl!}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setEmbedError(true)}
          />
        ) : (
          <>
            {/* Thumbnail / Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-900 to-surface-950 flex items-center justify-center">
              {/* Provider badge */}
              {provider && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-white">
                  {provider}
                </div>
              )}

              {/* Play Button */}
              <button
                onClick={handlePlay}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-primary/80 hover:border-brand-primary transition-all shadow-xl group/play"
              >
                <Play className="w-7 h-7 fill-white group-hover/play:scale-110 transition-transform ml-0.5" />
              </button>
            </div>

            {/* Error State */}
            {embedError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 text-slate-500 gap-2">
                <AlertTriangle className="w-8 h-8" />
                <p className="text-xs font-medium">Failed to embed video</p>
                <button
                  onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in new tab
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Caption */}
      {title && (
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-sm">{title}</h3>
            {url && (
              <p className="text-[10px] text-slate-500 truncate font-medium">
                {url.replace('https://', '').replace('http://', '')}
              </p>
            )}
          </div>
          {!canEmbed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
