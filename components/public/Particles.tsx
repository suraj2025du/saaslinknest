'use client';

import { motion } from 'motion/react';

// Pre-computed static deterministic particle definitions
// Guarantees exact 1:1 match between SSR and client DOM with zero hydration differences
const PARTICLES = [
  { id: 0, x: 14.2, y: 18.5, size: 2.5, duration: 6.8, delay: 0.3, opacity: 0.28 },
  { id: 1, x: 82.7, y: 12.1, size: 3.2, duration: 8.4, delay: 1.1, opacity: 0.34 },
  { id: 2, x: 45.6, y: 76.3, size: 1.8, duration: 5.9, delay: 2.4, opacity: 0.22 },
  { id: 3, x: 67.3, y: 34.8, size: 2.8, duration: 9.2, delay: 0.7, opacity: 0.38 },
  { id: 4, x: 23.9, y: 88.4, size: 3.5, duration: 7.5, delay: 3.2, opacity: 0.31 },
  { id: 5, x: 89.1, y: 64.2, size: 2.1, duration: 6.3, delay: 1.8, opacity: 0.25 },
  { id: 6, x: 34.5, y: 42.7, size: 3.0, duration: 8.9, delay: 0.5, opacity: 0.42 },
  { id: 7, x: 58.2, y: 19.3, size: 2.4, duration: 7.1, delay: 2.8, opacity: 0.19 },
  { id: 8, x: 11.8, y: 72.9, size: 3.6, duration: 9.6, delay: 1.4, opacity: 0.36 },
  { id: 9, x: 76.4, y: 85.1, size: 1.9, duration: 5.7, delay: 3.6, opacity: 0.27 },
  { id: 10, x: 28.3, y: 29.6, size: 2.7, duration: 7.8, delay: 0.9, opacity: 0.33 },
  { id: 11, x: 93.5, y: 41.2, size: 3.3, duration: 8.7, delay: 2.1, opacity: 0.29 },
  { id: 12, x: 52.7, y: 61.8, size: 2.2, duration: 6.5, delay: 1.6, opacity: 0.37 },
  { id: 13, x: 38.9, y: 92.4, size: 3.1, duration: 9.1, delay: 2.9, opacity: 0.24 },
  { id: 14, x: 64.1, y: 8.7, size: 2.6, duration: 7.3, delay: 0.4, opacity: 0.41 },
  { id: 15, x: 8.4, y: 53.5, size: 3.4, duration: 8.2, delay: 3.1, opacity: 0.30 },
  { id: 16, x: 71.8, y: 71.9, size: 2.0, duration: 6.1, delay: 1.3, opacity: 0.26 },
  { id: 17, x: 41.2, y: 15.4, size: 2.9, duration: 8.6, delay: 2.6, opacity: 0.35 },
  { id: 18, x: 86.6, y: 95.3, size: 3.7, duration: 9.4, delay: 0.8, opacity: 0.21 },
  { id: 19, x: 19.5, y: 38.1, size: 2.3, duration: 6.7, delay: 3.4, opacity: 0.39 },
  { id: 20, x: 61.4, y: 51.6, size: 2.8, duration: 7.9, delay: 1.7, opacity: 0.32 },
  { id: 21, x: 96.2, y: 24.8, size: 1.7, duration: 5.5, delay: 0.2, opacity: 0.28 },
  { id: 22, x: 32.7, y: 81.3, size: 3.5, duration: 9.0, delay: 2.3, opacity: 0.33 },
  { id: 23, x: 48.1, y: 4.2, size: 2.4, duration: 6.9, delay: 1.0, opacity: 0.40 },
  { id: 24, x: 15.6, y: 97.5, size: 3.1, duration: 8.3, delay: 3.7, opacity: 0.23 },
  { id: 25, x: 79.3, y: 47.9, size: 2.5, duration: 7.6, delay: 1.9, opacity: 0.36 },
  { id: 26, x: 26.4, y: 66.7, size: 3.8, duration: 9.8, delay: 0.6, opacity: 0.30 },
  { id: 27, x: 69.8, y: 27.4, size: 2.0, duration: 6.2, delay: 2.7, opacity: 0.25 },
  { id: 28, x: 5.7, y: 33.9, size: 2.6, duration: 7.4, delay: 1.5, opacity: 0.44 },
  { id: 29, x: 91.9, y: 79.2, size: 3.3, duration: 8.8, delay: 3.3, opacity: 0.27 },
  { id: 30, x: 37.1, y: 57.8, size: 2.2, duration: 6.4, delay: 0.1, opacity: 0.38 },
  { id: 31, x: 55.3, y: 89.6, size: 3.6, duration: 9.3, delay: 2.2, opacity: 0.31 },
  { id: 32, x: 74.9, y: 14.1, size: 1.8, duration: 5.8, delay: 1.2, opacity: 0.20 },
  { id: 33, x: 17.3, y: 45.8, size: 2.9, duration: 8.1, delay: 3.0, opacity: 0.35 },
  { id: 34, x: 84.8, y: 36.5, size: 3.4, duration: 9.5, delay: 0.4, opacity: 0.29 },
  { id: 35, x: 43.6, y: 70.4, size: 2.1, duration: 6.6, delay: 2.5, opacity: 0.41 },
  { id: 36, x: 62.9, y: 98.7, size: 2.7, duration: 7.7, delay: 1.7, opacity: 0.26 },
  { id: 37, x: 9.2, y: 84.3, size: 3.2, duration: 8.5, delay: 3.5, opacity: 0.34 },
  { id: 38, x: 98.1, y: 58.9, size: 2.5, duration: 7.2, delay: 0.9, opacity: 0.30 },
  { id: 39, x: 50.4, y: 22.1, size: 3.0, duration: 9.0, delay: 2.0, opacity: 0.37 },
];

export function Particles({ count = 40 }: { count?: number }) {
  const list = PARTICLES.slice(0, count);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {list.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
