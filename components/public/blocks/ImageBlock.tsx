'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface ImageBlockProps {
  title: string;
  url: string;
  imageUrl?: string;
  featured?: boolean;
  buttonStyle?: string;
  onClick?: () => void;
}

export default function ImageBlock({
  title,
  url,
  imageUrl,
  featured = false,
  buttonStyle = 'Rounded',
  onClick,
}: ImageBlockProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const displayImage = imageUrl || url;
  const hasValidImage = displayImage && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`w-full premium-card-gloss overflow-hidden transition-all duration-300 group relative ${
        buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-2xl'
      } ${featured ? 'ring-2 ring-brand-primary/50 shadow-xl shadow-brand-primary/10' : ''}`}
    >
      {featured && (
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary z-10" />
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-video bg-surface-800 overflow-hidden">
        {imgLoading && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-800">
            <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          </div>
        )}

        {hasValidImage ? (
          <Image
            src={displayImage}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={() => {
              setImgError(true);
              setImgLoading(false);
            }}
            onLoad={() => setImgLoading(false)}
            unoptimized
          />
        ) : null}

        {/* Error State */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-800 text-slate-500 gap-2">
            <AlertTriangle className="w-8 h-8" />
            <p className="text-xs font-medium">Failed to load image</p>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </div>

      {/* Caption */}
      {title && (
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-sm">{title}</h3>
            {url && (
              <p className="text-[10px] text-slate-500 truncate font-medium">
                {url.replace('https://', '').replace('http://', '')}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
