import { PageLayout } from '@/components/public/PageLayout';
import { ShieldCheck, Mail, Calendar, Globe, Lock, Eye, Database, UserCheck, Cookie, Info, Settings, Trash2, BarChart3, Zap } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | LinkNest — How We Use Cookies',
  description: 'Learn about the types of cookies we use on LinkNest and how you can manage your preferences. We use cookies to improve your experience and analyze site traffic.',
};

const PolicySection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
        <Icon className="w-6 h-6 text-brand-accent" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
    </div>
    <div className="text-slate-400 font-medium leading-relaxed space-y-6 pl-16">
      {children}
    </div>
  </div>
);

export default function CookiePolicyPage() {
  const lastUpdated = "April 5, 2026";

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-accent/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Cookie className="w-3 h-3 fill-brand-accent" />
            Legal & Cookies
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
            Cookie Policy.
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
            <PolicySection title="What are Cookies?" icon={Info}>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
              </p>
              <p>
                Cookies allow a website to recognize your device and remember certain information about your preferences or past actions.
              </p>
            </PolicySection>

            <PolicySection title="How We Use Cookies" icon={Eye}>
              <p>
                LinkNest uses cookies for several reasons. Some cookies are required for technical reasons for our platform to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our platform.
              </p>
              <p>
                Third parties serve cookies through our platform for advertising, analytics, and other purposes. This is described in more detail below.
              </p>
            </PolicySection>

            <PolicySection title="Cookie Categories" icon={Settings}>
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-brand-primary" />
                    Essential Cookies
                  </h4>
                  <p className="text-sm text-slate-400">These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas.</p>
                </div>
                
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-secondary" />
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-slate-400">These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you.</p>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-accent" />
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-slate-400">These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
                </div>
              </div>
            </PolicySection>

            <PolicySection title="Managing Cookies" icon={Trash2}>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
              </p>
              <p>
                You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us" icon={Mail}>
              <p>
                If you have any questions about our use of cookies or other technologies, please contact us at:
              </p>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
                <p className="text-white font-black mb-2">LinkNest Privacy Team</p>
                <a href="mailto:privacy@linknest.com" className="text-brand-accent font-black hover:underline">privacy@linknest.com</a>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">123 Creator Way, San Francisco, CA 94103</p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
