'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Shield } from 'lucide-react';
import { acceptCookies, declineCookies, shouldShowBanner } from '@/lib/cookieConsent';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowBanner()) {
        setIsVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    acceptCookies();
    setIsVisible(false);
  };

  const handleDecline = () => {
    declineCookies();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-consent-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-3xl">
            <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm mb-1">We value your privacy</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{' '}
                    <Link href="/privacy" className="text-brand-primary hover:underline inline-flex items-center gap-1">
                      Privacy Policy <Shield className="w-3 h-3" />
                    </Link>
                    .
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDecline}
                      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-slate-300 transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAccept}
                      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
