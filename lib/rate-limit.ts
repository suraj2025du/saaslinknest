/**
 * SECURITY: This file re-exports the database-backed persistent rate limiter.
 * All routes importing from '@/lib/rate-limit' will now use the DB-backed version
 * instead of the weak in-memory Map version.
 * 
 * This prevents rate limit bypass in serverless environments (Vercel, AWS Lambda).
 */

export { rateLimit, getIP, cleanupExpiredRateLimits } from './rate-limit-persistent';
