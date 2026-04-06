import { db } from './db';
import { rateLimits } from './schema';
import { eq, gt, lt, and } from 'drizzle-orm';

/**
 * Persistent rate limiter using database storage
 * Falls back to in-memory if DB is unavailable
 */

const fallbackMap = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60 * 1000 // 1 minute default
): Promise<{ success: boolean; remaining: number; resetAt: Date }> {
  // Try database-first approach
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    // Find existing record
    const existing = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.key, key))
      .limit(1);

    if (existing.length > 0) {
      const record = existing[0];
      const recordResetAt = new Date(record.resetAt);

      // If window has expired, reset
      if (now >= recordResetAt) {
        await db
          .update(rateLimits)
          .set({ count: 1, resetAt })
          .where(eq(rateLimits.key, key));
        return { success: true, remaining: limit - 1, resetAt };
      }

      // If over limit
      if ((record.count ?? 0) >= limit) {
        return { success: false, remaining: 0, resetAt: recordResetAt };
      }

      // Increment counter
      const newCount = (record.count ?? 0) + 1;
      await db
        .update(rateLimits)
        .set({ count: newCount })
        .where(eq(rateLimits.key, key));

      return { success: true, remaining: limit - newCount, resetAt: recordResetAt };
    } else {
      // Create new record
      await db.insert(rateLimits).values({
        key,
        count: 1,
        resetAt,
      });
      return { success: true, remaining: limit - 1, resetAt };
    }
  } catch (error) {
    // Fallback to in-memory
    console.warn('Rate limit DB error, using fallback:', error);
    return rateLimitFallback(key, limit, windowMs);
  }
}

function rateLimitFallback(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: Date } {
  const now = Date.now();
  const existing = fallbackMap.get(key);

  if (existing && now < existing.resetAt) {
    if (existing.count >= limit) {
      return { success: false, remaining: 0, resetAt: new Date(existing.resetAt) };
    }
    existing.count++;
    return { success: true, remaining: limit - existing.count, resetAt: new Date(existing.resetAt) };
  } else {
    const resetAt = now + windowMs;
    fallbackMap.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt: new Date(resetAt) };
  }
}

/**
 * Clean up expired rate limit records (run periodically)
 */
export async function cleanupExpiredRateLimits() {
  try {
    await db.delete(rateLimits).where(lt(rateLimits.resetAt, new Date()));
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * Secure IP extraction:
 * 1. x-real-ip first (set by Vercel/Cloudflare trusted proxy)
 * 2. First IP from x-forwarded-for chain (real client)
 * 3. Fallback to localhost
 */
export async function getIP(): Promise<string> {
  const { headers: headersList } = await import('next/headers');
  const headers = await headersList();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return '127.0.0.1';
}
