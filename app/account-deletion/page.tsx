import { PageLayout } from '@/components/public/PageLayout';
import { Trash2, AlertCircle, ShieldCheck, Mail, ArrowRight, Info, Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Account Deletion | LinkNest — Manage Your Data',
  description: 'Learn how to permanently delete your LinkNest account and all associated data. We provide clear instructions for managing your digital footprint.',
};

export default function AccountDeletionPage() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Trash2 className="w-3 h-3 fill-brand-primary" />
            Account Management
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Delete Account.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            We&apos;re sorry to see you go. If you&apos;ve decided to leave LinkNest, here&apos;s how you can permanently delete your account and all associated data.
          </p>
        </div>
      </section>

      {/* Instructions */}
      <section className="pb-40 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="premium-card p-12 md:p-16 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02] mb-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Info className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">How to Delete</h2>
            </div>
            
            <div className="space-y-8 text-slate-400 font-medium leading-relaxed">
              <p>To delete your LinkNest account, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-6">
                <li>
                  <strong className="text-white">Log in</strong> to your LinkNest account at <Link href="/login" className="text-brand-primary hover:underline">linknest.com/login</Link>.
                </li>
                <li>
                  Navigate to the <strong className="text-white">Settings</strong> tab in your dashboard.
                </li>
                <li>
                  Scroll down to the <strong className="text-white">Danger Zone</strong> section at the bottom of the page.
                </li>
                <li>
                  Click the <strong className="text-white">&quot;Delete Account&quot;</strong> button.
                </li>
                <li>
                  Confirm your decision by typing your username or password as prompted.
                </li>
              </ol>
              
              <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/20 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-brand-primary shrink-0 mt-1" />
                <p className="text-sm text-slate-300">
                  <strong className="text-brand-primary">Warning:</strong> Account deletion is permanent. All your links, analytics, and profile data will be immediately and irreversibly removed from our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="premium-card p-12 md:p-16 rounded-[3.5rem] border-white/5 shadow-2xl bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-6 h-6 text-brand-secondary" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Data Retention</h2>
            </div>
            
            <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
              <p>
                When you delete your account, we remove all personal information and content associated with your profile. However, some data may be retained for legal or administrative purposes:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Billing records and transaction history (for tax and accounting).</li>
                <li>Aggregated, non-identifiable usage data (for platform analytics).</li>
                <li>Customer support communications (for record-keeping).</li>
              </ul>
              <p>
                For more details, please review our <Link href="/privacy" className="text-brand-secondary hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Having Trouble?</h3>
            <p className="text-slate-500 font-medium mb-8">If you&apos;re unable to access your account or need assistance with deletion, please contact our support team.</p>
            <Link href="/contact" className="inline-flex items-center gap-3 text-brand-primary font-black uppercase tracking-widest text-xs hover:underline">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
