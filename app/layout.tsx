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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://linknest.tech'),
  title: 'LinkNest',
  description: 'Smart Link-in-Bio Platform for creators and businesses.',
  keywords: [
    'link in bio',
    'linknest',
    'link in bio tool',
    'creator platform',
    'social media links',
    'influencer tools',
    'digital portfolio',
    'bio link generator',
    'link management',
    'link tracking',
    'content creator tools',
    'Instagram link in bio',
    'TikTok link in bio',
    'Twitter link in bio',
    'personal landing page',
    'link shortener',
    'analytics platform',
  ],
  authors: [{ name: 'LinkNest Team', url: 'https://linknest.tech' }],
  creator: 'LinkNest',
  publisher: 'LinkNest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linknest.tech',
    siteName: 'LinkNest',
    title: 'LinkNest',
    description: 'Smart Link-in-Bio Platform for creators and businesses.',
    images: [
      {
        url: 'https://linknest.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinkNest - Smart Link-in-Bio Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@linknest', // Add your Twitter handle
    creator: '@linknest',
    title: 'LinkNest — Your Link-in-Bio, Reimagined',
    description: 'Share unlimited links, track analytics, and customize your creator identity. The only link-in-bio tool you ever need.',
    images: ['https://linknest.tech/og-image.png'],
  },
  alternates: {
    canonical: 'https://linknest.tech',
  },
  category: 'Technology',
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

