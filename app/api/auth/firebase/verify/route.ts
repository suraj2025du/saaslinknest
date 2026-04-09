import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, rateLimits } from '@/lib/schema';
import { setSession } from '@/lib/auth';
import { eq, and, gte, lt } from 'drizzle-orm';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import type { ServiceAccount } from 'firebase-admin';

// Rate limiting configuration
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const key = `firebase_auth:${ip}`;
    const now = new Date();
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

    // Clean old entries
    await db.delete(rateLimits).where(
      and(
        eq(rateLimits.key, key),
        lt(rateLimits.resetAt, now)
      )
    );

    // Check current counts
    const records = await db.select().from(rateLimits).where(
      and(
        eq(rateLimits.key, key),
        gte(rateLimits.resetAt, windowStart)
      )
    ).limit(1);

    const record = records[0];

    if (record && record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfter };
    }

    // Update or create record
    if (record) {
      await db.update(rateLimits).set({
        count: record.count + 1,
        resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
      }).where(eq(rateLimits.id, record.id));
    } else {
      await db.insert(rateLimits).values({
        key,
        count: 1,
        resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
      });
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Allow on error
  }
}

// Initialize Firebase Admin SDK
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Method 1: Use service account JSON file (recommended for local development)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

    if (serviceAccountPath) {
      try {
        const path = require('path');
        const fullPath = path.resolve(process.cwd(), serviceAccountPath);
        const serviceAccount = require(fullPath) as ServiceAccount;
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('✅ Firebase Admin initialized from JSON file');
        return getAuth();
      } catch (error) {
        console.warn('Failed to load Firebase service account file:', error);
      }
    }

    // Method 2: Use environment variables (recommended for production/Vercel)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials not configured');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n').replace(/\r/g, '').trim() + '\n',
      }),
    });
    console.log('✅ Firebase Admin initialized from env vars');
    return getAuth();
  }
  return getAuth();
}

export async function POST(req: Request) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const adminAuth = getFirebaseAdmin();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      );
    }

    // Find or create user in your database
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user = existingUsers[0];

    if (!user) {
      // Create new user
      const result = await db.insert(users).values({
        email,
        name: name || email.split('@')[0],
        openId: uid,
        loginMethod: 'google',
        role: 'user',
        emailVerified: true, // Google users are verified
      });

      // Fetch the created user
      const [createdUser] = await db.select().from(users).where(eq(users.id, result.insertId)).limit(1);
      user = createdUser;

      // Create profile with Google picture if available
      if (picture) {
        const { profiles } = await import('@/lib/schema');
        await db.insert(profiles).values({
          userId: user.id,
          username: email.split('@')[0],
          avatar: picture,
        });
      }
    } else {
      // Update existing user with Google info if they signed up differently before
      await db
        .update(users)
        .set({
          openId: uid,
          loginMethod: 'google',
          lastSignedIn: new Date(),
          emailVerified: true,
        })
        .where(eq(users.id, user.id));

      // Update profile picture if available and user doesn't have one
      if (picture) {
        const { profiles } = await import('@/lib/schema');
        const [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);

        if (existingProfile && !existingProfile.avatar) {
          await db.update(profiles).set({
            avatar: picture,
          }).where(eq(profiles.userId, user.id));
        }
      }
    }

    // Check if user is soft-deleted
    if (user.deletedAt) {
      return NextResponse.json(
        { error: 'This account has been deactivated' },
        { status: 403 }
      );
    }

    // Create session
    await setSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: picture || null,
      },
    });
  } catch (error: any) {
    console.error('Firebase token verification error:', error);

    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json(
        { error: 'Invalid Firebase token' },
        { status: 401 }
      );
    }

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Firebase token expired. Please sign in again.' },
        { status: 401 }
      );
    }

    if (error.message?.includes('Firebase Admin credentials not configured')) {
      return NextResponse.json(
        { error: 'Firebase not configured properly. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
