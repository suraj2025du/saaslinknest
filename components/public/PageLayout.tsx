'use client';

import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'motion/react';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface-950 text-slate-200 selection:bg-brand-primary/30 antialiased overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};
