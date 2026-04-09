import { PageLayout } from '@/components/public/PageLayout';
import { ShieldCheck, Mail, Calendar, Globe, Lock, Eye, Database, UserCheck, AlertTriangle, Info, ExternalLink, Zap } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer | LinkNest — Important Information',
  description: 'Read the general disclaimer for using LinkNest. This page outlines the limitations of our liability and the nature of the information provided on our platform.',
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

export default function DisclaimerPage() {
  const lastUpdated = "April 5, 2026";

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-secondary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <AlertTriangle className="w-3 h-3 fill-brand-secondary" />
            Legal & Disclaimers
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Disclaimer.
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
            <PolicySection title="General Information" icon={Info}>
              <p>
                The information provided by LinkNest on our website and through our platform is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
              <p>
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </PolicySection>

            <PolicySection title="External Links Disclaimer" icon={ExternalLink}>
              <p>
                The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
              </p>
              <p>
                We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
              </p>
            </PolicySection>

            <PolicySection title="Professional Disclaimer" icon={ShieldCheck}>
              <p>
                The site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
              </p>
              <p>
                The use or reliance of any information contained on the site is solely at your own risk.
              </p>
            </PolicySection>

            <PolicySection title="Testimonials Disclaimer" icon={Zap}>
              <p>
                The site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services.
              </p>
              <p>
                We do not claim, and you should not assume, that all users will have the same experiences. Your individual results may vary.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us" icon={Mail}>
              <p>
                If you have any questions about this Disclaimer, please contact us at:
              </p>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
                <p className="text-white font-black mb-2">LinkNest Legal Team</p>
                <a href="mailto:legal@linknest.tech" className="text-brand-secondary font-black hover:underline">legal@linknest.tech</a>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">123 Creator Way, San Francisco, CA 94103</p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
