import { PageLayout } from '@/components/public/PageLayout';
import { Zap, ArrowLeft, Home, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageLayout>
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-32 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-12 group hover:scale-110 transition-transform">
            <AlertCircle className="w-12 h-12 text-brand-primary" />
          </div>
          
          <h1 className="text-8xl md:text-[10rem] font-black mb-8 tracking-tighter leading-none text-gradient">
            404
          </h1>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white">
            Lost in the Nest?
          </h2>
          
          <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a new digital home. Let&apos;s get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/" className="inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-white/10 transition-all">
              <Search className="w-5 h-5" />
              Help Center
            </Link>
          </div>
          
          <div className="mt-20 pt-12 border-t border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 mb-6">Popular Pages</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Features', 'Pricing', 'About', 'Blog'].map((page) => (
                <Link 
                  key={page} 
                  href={`/${page.toLowerCase()}`}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
