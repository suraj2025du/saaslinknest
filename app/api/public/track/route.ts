import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analytics } from '@/lib/schema';
import { rateLimit, getIP } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success, error } = await rateLimit(ip, 60); // 60 requests per minute

    if (!success) {
      return NextResponse.json({ error }, { status: 429 });
    }

    const body = await req.json();
    const { userId, linkId, eventType, device, country, referrer, sessionId } = body;

    if (!userId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(analytics).values({
      userId,
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
