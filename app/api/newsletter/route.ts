import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { rateLimit, getIP } from '@/lib/rate-limit';

// GET: List all newsletter subscribers (admin only)
export async function GET(req: NextRequest) {
  try {
    // TODO: Add admin auth check
    const subscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
    return NextResponse.json({ success: true, subscribers });
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
