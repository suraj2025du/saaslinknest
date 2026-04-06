import { PageLayout } from '@/components/public/PageLayout';
import { ShieldCheck, Mail, Calendar, Globe, Lock, Eye, Database, UserCheck, CreditCard, RefreshCcw, XCircle, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | LinkNest — Our Billing Rules',
  description: 'Understand the conditions for refunds and the process for cancelling your LinkNest subscription. We offer a 14-day money-back guarantee.',
};

const PolicySection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
        <Icon className="w-6 h-6 text-brand-primary" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
    </div>
    <div className="text-slate-400 font-medium leading-relaxed space-y-6 pl-16">
      {children}
    </div>
  </div>
);

export default function RefundPolicyPage() {
  const lastUpdated = "April 5, 2026";

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <CreditCard className="w-3 h-3 fill-brand-primary" />
            Legal & Billing
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Refund Policy.
          </h1>
          <p className="text-xl text-slate-500 font-black uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="premium-card p-12 md:p-20 rounded-[4rem] border-white/5 shadow-2xl bg-white/[0.02]">
            <PolicySection title="Subscription Cancellation" icon={XCircle}>
              <p>
                You may cancel your LinkNest Pro subscription at any time. To cancel, navigate to your Account Settings and select the &quot;Cancel Subscription&quot; option.
              </p>
              <p>
                Upon cancellation, you will continue to have access to all Pro features until the end of your current billing cycle. No further charges will be made to your account.
              </p>
            </PolicySection>

            <PolicySection title="14-Day Money-Back Guarantee" icon={RefreshCcw}>
              <p>
                We offer a full refund for any Pro or Lifetime subscription within 14 days of the initial purchase date. If you are not satisfied with LinkNest for any reason, please contact our support team within this period.
              </p>
              <p>
                Refunds are processed to the original payment method and typically take 5-10 business days to appear in your account.
              </p>
            </PolicySection>

            <PolicySection title="Refund Conditions" icon={AlertCircle}>
              <p>
                To be eligible for a refund, you must:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Submit your request within 14 days of your purchase.</li>
                <li>Not have violated our Terms of Service.</li>
                <li>Provide a valid reason for the refund request (this helps us improve).</li>
              </ul>
              <p>
                Please note that renewal payments for monthly or annual subscriptions are generally non-refundable unless required by law or in exceptional circumstances at our discretion.
              </p>
            </PolicySection>

            <PolicySection title="Non-Refundable Situations" icon={AlertCircle}>
              <p>
                We do not offer refunds in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Requests made after the 14-day guarantee period.</li>
                <li>Accounts terminated due to violations of our Terms of Service.</li>
                <li>Partial months of service for cancelled subscriptions.</li>
                <li>Promotional or discounted purchases where &quot;no refunds&quot; was explicitly stated.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Contact Us" icon={Mail}>
              <p>
                If you have any questions about our Refund or Cancellation Policy, please contact us at:
              </p>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
                <p className="text-white font-black mb-2">LinkNest Billing Team</p>
                <a href="mailto:billing@linknest.com" className="text-brand-primary font-black hover:underline">billing@linknest.com</a>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">123 Creator Way, San Francisco, CA 94103</p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
