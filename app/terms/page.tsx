import { PageLayout } from '@/components/public/PageLayout';
import { ShieldCheck, Mail, Calendar, Globe, Lock, Eye, Database, UserCheck, FileText, Gavel, AlertCircle, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | LinkNest — Our Rules and Policies',
  description: 'Read the terms and conditions for using LinkNest. These rules govern your access to and use of our platform and services.',
};

const PolicySection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/20">
        <Icon className="w-6 h-6 text-brand-secondary" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
    </div>
    <div className="text-slate-400 font-medium leading-relaxed space-y-6 pl-16">
      {children}
    </div>
  </div>
);

export default function TermsPage() {
  const lastUpdated = "April 5, 2026";

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-secondary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <FileText className="w-3 h-3 fill-brand-secondary" />
            Legal & Terms
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Terms of Service.
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
            <PolicySection title="Acceptance of Terms" icon={Gavel}>
              <p>
                By accessing or using LinkNest, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              <p>
                The materials contained in this website are protected by applicable copyright and trademark law.
              </p>
            </PolicySection>

            <PolicySection title="Account Responsibilities" icon={UserCheck}>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
              </p>
            </PolicySection>

            <PolicySection title="Intellectual Property" icon={ShieldCheck}>
              <p>
                The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of LinkNest and its licensors.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of LinkNest.
              </p>
            </PolicySection>

            <PolicySection title="Acceptable Use" icon={AlertCircle}>
              <p>
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail&quot;, &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate LinkNest, a LinkNest employee, another user, or any other person or entity.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Payments & Subscriptions" icon={CreditCard}>
              <p>
                Some parts of the Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in advance on a recurring and periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
              </p>
              <p>
                A valid payment method, including credit card, is required to process the payment for your Subscription. You shall provide LinkNest with accurate and complete billing information including full name, address, state, zip code, and a valid payment method information.
              </p>
            </PolicySection>

            <PolicySection title="Limitation of Liability" icon={AlertCircle}>
              <p>
                In no event shall LinkNest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
              </p>
            </PolicySection>

            <PolicySection title="Governing Law" icon={Globe}>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us" icon={Mail}>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
                <p className="text-white font-black mb-2">LinkNest Legal Team</p>
                <a href="mailto:legal@linknest.com" className="text-brand-secondary font-black hover:underline">legal@linknest.com</a>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">123 Creator Way, San Francisco, CA 94103</p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
