import { PageLayout } from '@/components/public/PageLayout';
import { Zap, ArrowRight, Globe, ShieldCheck, UserCheck, HelpCircle, Mail, BarChart3, Palette, Layout, Search, Smartphone, Share2, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Sitemap | LinkNest — Explore Our Platform',
  description: 'A comprehensive map of all pages and resources available on LinkNest. Find exactly what you need to grow your digital presence.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Product',
      icon: Zap,
      links: [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Themes', href: '/features#themes' },
        { name: 'Analytics', href: '/features#analytics' },
      ]
    },
    {
      title: 'Company',
      icon: Globe,
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Legal',
      icon: ShieldCheck,
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Refund Policy', href: '/refund' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      links: [
        { name: 'Help Center', href: '/faq' },
        { name: 'Account Deletion', href: '/account-deletion' },
        { name: 'Data Deletion', href: '/data-deletion' },
      ]
    }
  ];

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Globe className="w-3 h-3 fill-brand-primary" />
            Platform Map
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Sitemap.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            A comprehensive map of all pages and resources available on LinkNest. Find exactly what you need to grow your digital presence.
          </p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {sections.map((section, i) => (
            <div key={i} className="premium-card p-10 rounded-[3rem] border-white/5 shadow-2xl bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <section.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{section.title}</h2>
              </div>
              
              <ul className="space-y-6">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-slate-400 font-bold hover:text-white transition-colors flex items-center justify-between group">
                      {link.name}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto premium-card-gloss p-16 rounded-[4rem] border-brand-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-primary/5 -z-10" />
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white">Ready to start?</h2>
          <p className="text-xl text-slate-400 mb-12 font-medium">Join 50,000+ creators who trust LinkNest with their digital identity.</p>
          <Link href="/signup" className="inline-flex items-center gap-3 bg-brand-primary text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30">
            Get Started for Free
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
