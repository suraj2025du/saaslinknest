import { PageLayout } from '@/components/public/PageLayout';
import { ShieldCheck, Mail, Calendar, Globe, Lock, Eye, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | LinkNest — Your Data Security',
  description: 'Learn how LinkNest collects, uses, and protects your personal data. We are committed to transparency and your privacy rights.',
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

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 5, 2026";

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <ShieldCheck className="w-3 h-3 fill-brand-primary" />
            Legal & Privacy
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Privacy Policy.
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
            <PolicySection title="Introduction" icon={Globe}>
              <p>
                At LinkNest, your privacy is our top priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
              </p>
              <p>
                By using LinkNest, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </PolicySection>

            <PolicySection title="Information We Collect" icon={Database}>
              <p>
                We collect information that you provide directly to us when you create an account, update your profile, or communicate with us. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-white">Account Information:</strong> Name, email address, password, and profile details.</li>
                <li><strong className="text-white">Profile Content:</strong> Links, images, bios, and other content you post to your LinkNest profile.</li>
                <li><strong className="text-white">Payment Information:</strong> Billing address and payment details (processed securely via Stripe).</li>
                <li><strong className="text-white">Communications:</strong> Any feedback or support requests you send to us.</li>
              </ul>
            </PolicySection>

            <PolicySection title="How We Use Your Data" icon={Eye}>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>To provide, maintain, and improve our platform.</li>
                <li>To process transactions and send related information.</li>
                <li>To send you technical notices, updates, and support messages.</li>
                <li>To respond to your comments and questions.</li>
                <li>To monitor and analyze trends, usage, and activities.</li>
                <li>To personalize your experience and deliver relevant content.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Cookies & Tracking" icon={Lock}>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
              </p>
            </PolicySection>

            <PolicySection title="Third-Party Tools" icon={UserCheck}>
              <p>
                We may employ third-party companies and individuals to facilitate our platform, provide the platform on our behalf, perform platform-related services, or assist us in analyzing how our platform is used.
              </p>
              <p>
                These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. Common third parties include Stripe (payments), Google Analytics (usage data), and AWS (hosting).
              </p>
            </PolicySection>

            <PolicySection title="Your Privacy Rights" icon={ShieldCheck}>
              <p>
                Depending on your location, you may have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>The right to access the personal data we hold about you.</li>
                <li>The right to request that we correct any inaccurate personal data.</li>
                <li>The right to request that we delete your personal data.</li>
                <li>The right to object to our processing of your personal data.</li>
                <li>The right to data portability.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Contact Us" icon={Mail}>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
                <p className="text-white font-black mb-2">LinkNest Privacy Team</p>
                <a href="mailto:privacy@linknest.com" className="text-brand-primary font-black hover:underline">privacy@linknest.com</a>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">123 Creator Way, San Francisco, CA 94103</p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
