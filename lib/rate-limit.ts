import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export async function rateLimit(ip: string, limit: number = 60, windowMs: number = 60000) {
  const now = Date.now();
  const rateLimit = rateLimitMap.get(ip);

  if (rateLimit && now < rateLimit.resetAt) {
    if (rateLimit.count >= limit) {
      return { success: false, error: 'Too many requests' };
    }
    rateLimit.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
  }

  return { success: true };
}

export async function getIP() {
  const headerList = await headers();
  return headerList.get('x-forwarded-for') || 'unknown';
}
