'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isTrackingAllowed } from '@/lib/cookieConsent';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track if user has accepted cookies
    if (!isTrackingAllowed()) {
      return;
    }

    const trackPageview = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: window.location.href,
            pathname,
            referrer: document.referrer,
            device: getDeviceType(),
          }),
        });
      } catch (error) {
        // Silently fail analytics
        console.error('Analytics failed:', error);
      }
    };

    trackPageview();
  }, [pathname, searchParams]);

  return null;
}

function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
