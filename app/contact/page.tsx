'use client';

import { PageLayout } from '@/components/public/PageLayout';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Twitter, Instagram, Github, Globe, MapPin, Send, ArrowRight, HelpCircle, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@linknest.com';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setError('');
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <MessageSquare className="w-3 h-3 fill-brand-primary" />
            Get In Touch
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            We&apos;re Here to <br /> Help You Grow.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hi? Our team is always ready to connect with the creator community.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
          {/* Contact Form */}
          <div className="premium-card-gloss p-12 rounded-[3.5rem] border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Send className="w-40 h-40 text-brand-primary" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Send us a Message</h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Message Sent!</h3>
                  <p className="text-slate-400 font-medium mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button
                    onClick={resetForm}
                    className="text-brand-primary font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-bold appearance-none"
                    >
                      <option className="bg-surface-950" value="General Inquiry">General Inquiry</option>
                      <option className="bg-surface-950" value="Technical Support">Technical Support</option>
                      <option className="bg-surface-950" value="Billing Question">Billing Question</option>
                      <option className="bg-surface-950" value="Partnership Opportunity">Partnership Opportunity</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Your Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-600 text-center font-medium pt-4">
                    Or email us directly at{' '}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-primary hover:underline">
                      {SUPPORT_EMAIL}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center gap-12">
            <div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">Direct Channels</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 tracking-tight">Email Support</h4>
                    <p className="text-slate-500 font-medium mb-2">For all inquiries and help requests.</p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-primary font-black hover:underline">{SUPPORT_EMAIL}</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 tracking-tight">Live Chat</h4>
                    <p className="text-slate-500 font-medium mb-2">Available Mon-Fri, 9am - 6pm PST.</p>
                    <button className="text-brand-secondary font-black hover:underline">Start a Conversation</button>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 tracking-tight">Business Office</h4>
                    <p className="text-slate-500 font-medium mb-2">Our physical headquarters.</p>
                    <address className="text-slate-300 font-bold not-italic">123 Creator Way, Suite 400<br />San Francisco, CA 94103</address>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Follow our Journey</h4>
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Github, href: '#' },
                  { icon: Globe, href: '#' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Links */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <Link href="/faq" className="premium-card p-10 rounded-[3rem] border-white/5 group hover:border-brand-primary/20 transition-all">
            <HelpCircle className="w-10 h-10 text-brand-primary mb-6" />
            <h4 className="text-xl font-black text-white mb-3 tracking-tight">Help Center</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Find answers to common questions about setup, billing, and more.</p>
            <div className="text-brand-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Browse FAQ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/privacy" className="premium-card p-10 rounded-[3rem] border-white/5 group hover:border-brand-secondary/20 transition-all">
            <ShieldCheck className="w-10 h-10 text-brand-secondary mb-6" />
            <h4 className="text-xl font-black text-white mb-3 tracking-tight">Privacy & Security</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Learn how we protect your data and maintain your privacy.</p>
            <div className="text-brand-secondary font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Learn More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div className="premium-card p-10 rounded-[3rem] border-white/5 group">
            <Mail className="w-10 h-10 text-brand-accent mb-6" />
            <h4 className="text-xl font-black text-white mb-3 tracking-tight">Press Inquiries</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Are you a journalist or media outlet? We&apos;d love to talk.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-accent font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Contact Press
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
