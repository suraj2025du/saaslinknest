'use client';

import Link from 'next/link';
import { Zap, Twitter, Instagram, Github, Mail, Globe, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Themes', href: '/features#themes' },
      { name: 'Analytics', href: '/features#analytics' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
    support: [
      { name: 'Help Center', href: '/faq' },
      { name: 'Account Deletion', href: '/account-deletion' },
      { name: 'Data Deletion', href: '/data-deletion' },
      { name: 'Sitemap', href: '/sitemap' },
    ]
  };

  return (
    <footer className="py-32 px-6 border-t border-white/5 relative bg-surface-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20 group-hover:rotate-12 transition-transform">
                <Zap className="text-white w-7 h-7 fill-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">LinkNest</span>
            </Link>
            <p className="text-slate-500 max-w-xs font-medium leading-relaxed mb-10">
              The premium smart link-in-bio platform for the modern creator economy. Beautifully crafted, deeply insightful.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: 'mailto:support@linknest.tech' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Product</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
              {footerLinks.product.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Company</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
              {footerLinks.company.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Legal</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs font-black text-slate-600 uppercase tracking-widest">
            <span>© {currentYear} LinkNest. All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
              Made with <Heart className="w-3 h-3 text-brand-primary fill-brand-primary" /> for Creators
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              Secure Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
