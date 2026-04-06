/**
 * Parse user agent to detect device type, browser, and OS
 */

export function parseUserAgent(userAgent: string): {
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();

  // Device type detection
  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  }
  
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)) {
    device = 'tablet';
  }

  // Browser detection
  let browser = 'unknown';
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  // OS detection
  let os = 'unknown';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}

/**
 * Get country from request headers (using Cloudflare or similar CDN)
 */
export function getCountryFromHeaders(headers: Headers): string {
  return headers.get('cf-ipcountry') || 
         headers.get('x-country') || 
         'unknown';
}
