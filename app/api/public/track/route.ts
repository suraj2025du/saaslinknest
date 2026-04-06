import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analytics, profiles, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { rateLimit, getIP } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success } = await rateLimit(ip, 60); // 60 requests per minute

    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { userId, linkId, eventType, device, country, referrer, sessionId, username } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // SECURITY: Validate userId corresponds to a real user
    // If tracking via username, look up the user
    let validUserId: number | null = null;
    if (username) {
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.username, username),
      });
      if (profile) {
        validUserId = profile.userId;
      }
    } else if (userId) {
      // Verify userId exists
      const user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(userId)),
      });
      if (user) {
        validUserId = user.id;
      }
    }

    if (!validUserId) {
      return NextResponse.json({ error: 'Invalid user or profile not found' }, { status: 400 });
    }

    await db.insert(analytics).values({
      userId: validUserId,
      linkId: linkId || null,
      eventType,
      device: device || 'desktop',
      country: country || 'Unknown',
      referrer: referrer || 'direct',
      sessionId: sessionId || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
