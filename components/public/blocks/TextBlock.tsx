'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Type, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface TextBlockProps {
  title: string;
  content?: string;
  url?: string;
  featured?: boolean;
  buttonStyle?: string;
  onClick?: () => void;
}

export default function TextBlock({
  title,
  content,
  url,
  featured = false,
  buttonStyle = 'Rounded',
  onClick,
}: TextBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayContent = content || title;
  const shouldTruncate = displayContent.length > 150;
  const visibleContent = shouldTruncate && !isExpanded
    ? displayContent.slice(0, 150) + '...'
    : displayContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`w-full premium-card-gloss p-5 transition-all duration-300 group relative ${
        buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Pill' ? 'rounded-full' : 'rounded-2xl'
      } ${featured ? 'ring-2 ring-brand-primary/50 shadow-xl shadow-brand-primary/10' : ''}`}
    >
      {featured && (
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary z-10" />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          featured ? 'bg-black/5' : 'bg-white/5'
        }`}>
          <Type className={`w-5 h-5 ${featured ? 'text-black/40' : 'text-brand-primary'}`} />
        </div>

        {title && content && title !== content && (
          <h3 className="font-bold text-white text-base flex-1">{title}</h3>
        )}

        {url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors shrink-0"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words ${
        featured ? 'text-black/70' : ''
      }`}>
        {visibleContent}
      </div>

      {/* Expand/Collapse */}
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors ${
            featured ? 'text-black/50 hover:text-black/80' : 'text-slate-500 hover:text-white'
          }`}
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
