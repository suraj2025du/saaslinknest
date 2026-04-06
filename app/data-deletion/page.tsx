import { PageLayout } from '@/components/public/PageLayout';
import { Trash2, AlertCircle, ShieldCheck, Mail, ArrowRight, Info, Lock, Database, Search, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Data Deletion Request | LinkNest — Manage Your Data',
  description: 'Submit a request to delete your personal data from LinkNest. We are committed to transparency and your privacy rights.',
};

export default function DataDeletionPage() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-accent/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Database className="w-3 h-3 fill-brand-accent" />
            Privacy & Data
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Data Deletion.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Manage your digital footprint. Submit a request to delete your personal data from our platform. We are committed to transparency and your privacy rights.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-40 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="premium-card p-12 md:p-16 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02] mb-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-6 h-6 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Your Data Rights</h2>
            </div>
            
            <div className="space-y-8 text-slate-400 font-medium leading-relaxed">
              <p>
                Under GDPR and other privacy regulations, you have the right to request the deletion of your personal data. We provide two ways to exercise this right:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-brand-primary" />
                    Self-Service
                  </h4>
                  <p className="text-sm text-slate-500 mb-6">Delete your account and all associated data directly from your dashboard.</p>
                  <Link href="/account-deletion" className="text-brand-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline">
                    View Instructions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-secondary" />
                    Manual Request
                  </h4>
                  <p className="text-sm text-slate-500 mb-6">Submit a request to our privacy team to delete your data manually.</p>
                  <a href="mailto:privacy@linknest.com" className="text-brand-secondary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline">
                    Email Privacy Team
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-12 md:p-16 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Info className="w-6 h-6 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">What We Delete</h2>
            </div>
            
            <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
              <p>
                When you submit a data deletion request, we will remove the following information from our active databases:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Your name, email address, and account profile.</li>
                <li>All links, images, and content posted to your LinkNest profile.</li>
                <li>Your analytics and tracking data.</li>
                <li>Your billing information (except as required for legal/tax records).</li>
              </ul>
              <p>
                For more details, please review our <Link href="/privacy" className="text-brand-accent hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Still have questions?</h3>
            <p className="text-slate-500 font-medium mb-8">If you&apos;re unsure about how your data is handled or need assistance with a deletion request, please contact our privacy team.</p>
            <Link href="/contact" className="inline-flex items-center gap-3 text-brand-accent font-black uppercase tracking-widest text-xs hover:underline">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
