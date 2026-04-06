import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { CookieConsent } from '@/components/public/CookieConsent';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { BugReportModal } from '@/components/BugReportModal';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata = {
  title: {
    default: 'LinkNest — Smart Link-in-Bio for Creators',
    template: '%s | LinkNest',
  },
  description: 'The premium platform for sharing multiple links, tracking analytics, and customizing your creator identity. Create your personal hub in seconds.',
  keywords: ['link in bio', 'creator platform', 'social media links', 'influencer tools', 'digital portfolio'],
  authors: [{ name: 'LinkNest Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linkne.st',
    siteName: 'LinkNest',
    title: 'LinkNest — Your Link-in-Bio, Reimagined',
    description: 'Track, customize, and grow your presence with LinkNest. The only link-in-bio tool you ever need.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'LinkNest Platform Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkNest — Your Link-in-Bio, Reimagined',
    description: 'Track, customize, and grow your presence with LinkNest.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-surface-950 text-slate-200 selection:bg-brand-primary/30 antialiased overflow-x-hidden">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <BugReportModal />
        <CookieConsent />
      </body>
    </html>
  );
}

