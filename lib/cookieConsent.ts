const CONSENT_KEY = 'cookie-consent';
const SESSION_KEY = 'cookie-consent-session';

export type ConsentStatus = 'accepted' | 'declined' | 'unset';

/**
 * Check if the user has given cookie consent.
 * Returns 'accepted', 'declined', or 'unset'.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'unset';

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'true') return 'accepted';
  if (consent === 'false') return 'declined';
  return 'unset';
}

/**
 * Record that the user accepted cookies.
 */
export function acceptCookies(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'true');
  sessionStorage.setItem(SESSION_KEY, 'true');
}

/**
 * Record that the user declined cookies.
 */
export function declineCookies(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'false');
  sessionStorage.setItem(SESSION_KEY, 'false');
}

/**
 * Check if analytics tracking is allowed.
 * Only returns true if the user explicitly accepted.
 */
export function isTrackingAllowed(): boolean {
  return getConsentStatus() === 'accepted';
}

/**
 * Check if the consent banner has already been dismissed this session.
 */
export function hasSeenBannerThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

/**
 * Check if the banner should be shown.
 * Shows only when consent is unset AND the banner hasn't been shown this session.
 */
export function shouldShowBanner(): boolean {
  return getConsentStatus() === 'unset' && !hasSeenBannerThisSession();
}

/**
 * Reset consent (useful for settings pages).
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
