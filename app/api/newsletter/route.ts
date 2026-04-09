import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { rateLimit, getIP } from '@/lib/rate-limit';
import { getSession } from '@/lib/auth';

// Helper: Check admin role
async function requireAdmin() {
  const session = await getSession();
  if (!session?.userId) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId as number),
  });

  if (user?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { userId: session.userId as number, user };
}

// GET: List all newsletter subscribers (admin only)
export async function GET(req: NextRequest) {
  try {
    // SECURITY: Admin auth check
    const auth = await requireAdmin();
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ success: true, subscribers, pagination: { page, limit } });
  } catch (error) {
    console.error('Newsletter fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Rate limit newsletter subscriptions (5 per minute per IP)
    const ip = await getIP();
    const { success } = await rateLimit(`newsletter:${ip}`, 5, 60000);
    if (!success) {
      return NextResponse.json({ error: 'Too many subscriptions' }, { status: 429 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].subscribed) {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      // Re-subscribe
      await db
        .update(newsletterSubscribers)
        .set({ subscribed: true, unsubscribedAt: null })
        .where(eq(newsletterSubscribers.email, email));
    } else {
      await db.insert(newsletterSubscribers).values({ email });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await db
      .update(newsletterSubscribers)
      .set({ subscribed: false, unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.email, email));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
