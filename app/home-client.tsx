'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, BarChart3, Palette, Globe, ShieldCheck, Zap, Users, Star, Play, Sparkles, HelpCircle } from 'lucide-react';
import { PageLayout } from '@/components/public/PageLayout';

const Feature = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="premium-card p-10 rounded-[3rem] group relative overflow-hidden border-white/5 hover:border-brand-primary/20 transition-all"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-all" />
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-white/10">
      <Icon className="w-7 h-7 text-brand-primary" />
    </div>
    <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

export default function HomeClient() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl"
            >
              <Sparkles className="w-3 h-3 fill-brand-primary" />
              The Luxury Creator Standard
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-7xl md:text-[7.5rem] font-black tracking-tighter leading-[0.85] mb-10 text-gradient"
            >
              Build Your <br />
              <span className="text-gradient-primary">Digital <br /></span>
              Empire.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed font-medium"
            >
              The premium smart link-in-bio platform for elite creators, influencers, and modern brands. Beautifully crafted, deeply insightful.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/signup" className="bg-brand-primary text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-brand-primary/90 transition-all shadow-[0_20px_50px_rgba(217,70,239,0.3)] flex items-center justify-center gap-3 group relative overflow-hidden">
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-950 bg-surface-800 flex items-center justify-center overflow-hidden relative">
                      <Image src={`https://picsum.photos/seed/${i}/100/100`} alt="User" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-sm">50k+ Creators</span>
              </div>
            </div>
          </motion.div>

          {/* Product Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 p-6 glass-gloss rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-white/10 max-w-[400px] mx-auto">
              <div className="bg-surface-950 rounded-[3rem] overflow-hidden aspect-[9/19] border border-white/5 relative flex flex-col">
                {/* Mockup Content */}
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-brand-primary via-brand-electric to-brand-accent mb-6 shadow-2xl p-1">
                    <div className="w-full h-full rounded-[2.2rem] bg-surface-950 overflow-hidden border-4 border-surface-950 relative">
                      <Image src="https://picsum.photos/seed/creator/200/200" alt="Creator" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="h-5 w-32 bg-white rounded-full mb-3 shadow-lg" />
                  <div className="h-3 w-48 bg-white/10 rounded-full mb-12" />
                  
                  <div className="w-full space-y-4">
                    {[
                      { color: 'brand-primary', icon: Play },
                      { color: 'brand-electric', icon: Globe },
                      { color: 'brand-accent', icon: Star },
                    ].map((item, i) => (
                      <div key={i} className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center px-5 group cursor-pointer hover:bg-white/10 transition-all">
                        <div className={`w-8 h-8 rounded-lg bg-${item.color}/20 flex items-center justify-center`}>
                          <item.icon className={`w-4 h-4 text-${item.color}`} />
                        </div>
                        <div className="ml-4 h-2 w-28 bg-white/20 rounded-full" />
                        <ArrowRight className="ml-auto w-4 h-4 text-white/20" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Brand Footer */}
                <div className="p-6 border-t border-white/5 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Zap className="w-3 h-3 fill-brand-primary text-brand-primary" />
                    Built with LinkNest
                  </div>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-brand-primary/10 blur-[150px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-40 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
              Built for the <br /> <span className="text-gradient-primary">Modern Creator.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              LinkNest provides the elite tools you need to manage your online presence, understand your audience, and grow your brand.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={Palette} 
              title="Designer Themes" 
              description="Choose from a curated collection of premium themes or build your own with our advanced gradient picker." 
              delay={0.1}
            />
            <Feature 
              icon={BarChart3} 
              title="Deep Insights" 
              description="Track every click and view with real-time analytics. Understand your audience like never before." 
              delay={0.2}
            />
            <Feature 
              icon={Zap} 
              title="Smart Links" 
              description="Schedule links, password-protect content, and use deep links to open apps directly." 
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-secondary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white">Loved by Elite Creators</h2>
            <div className="flex items-center justify-center gap-1 text-brand-secondary">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-brand-secondary" />)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Alex Rivers", role: "Lifestyle Creator", text: "LinkNest transformed how I connect with my audience. The analytics are game-changing and the themes are just beautiful." },
              { name: "Sarah Chen", role: "Tech Influencer", text: "Finally, a link-in-bio tool that actually feels premium. The custom domain support is exactly what I needed for my brand." },
              { name: "Marcus Thorne", role: "Fitness Coach", text: "The smart links feature is incredible. I can schedule my workout launches and they just work. Highly recommended." }
            ].map((t, i) => (
              <div key={i} className="premium-card p-10 rounded-[3rem] border-white/5 bg-white/[0.02]">
                <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
              &quot;{t.text}&quot;
            </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-white/10 shadow-xl">
                    <Image src={`https://picsum.photos/seed/${t.name}/100/100`} alt={t.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-white font-black tracking-tight">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Preview */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto premium-card-gloss p-16 rounded-[4rem] border-brand-primary/20 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-primary/5 -z-10" />
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white">Start Your Empire.</h2>
          <p className="text-xl text-slate-400 mb-12 font-medium">Join 50,000+ creators who trust LinkNest with their digital identity.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-3 bg-brand-primary text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30">
              Get Started for Free
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-white/10 transition-all">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-40 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white">Quick FAQ</h2>
            <p className="text-slate-400 font-medium">Answers to the most common questions.</p>
          </div>
          
          <div className="space-y-6">
            {[
              { q: "Is LinkNest free?", a: "Yes! Our Starter plan is free forever and includes up to 50 links and basic analytics." },
              { q: "Can I use my own domain?", a: "Absolutely. Pro users can connect their own custom domain for a fully branded experience." },
              { q: "How do I track my analytics?", a: "You can track views, clicks, and geographic data in real-time directly from your dashboard." }
            ].map((faq, i) => (
              <div key={i} className="premium-card p-8 rounded-3xl border-white/5 group">
                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-brand-primary" />
                  {faq.q}
                </h4>
                <p className="text-slate-400 font-medium leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/faq" className="text-brand-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center justify-center gap-2">
              View all FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
