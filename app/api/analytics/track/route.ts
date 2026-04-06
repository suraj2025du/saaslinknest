import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analytics, profiles } from '@/lib/schema';
import { eq, count, and } from 'drizzle-orm';
import { getIP, rateLimit } from '@/lib/rate-limit';
import { parseUserAgent, getCountryFromHeaders } from '@/lib/device-detect';
import { headers } from 'next/headers';
import { checkMilestones, sendMilestoneEmail, trackMilestone } from '@/lib/milestones';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success, error } = await rateLimit(`track:${ip}`, 30, 60000);

    if (!success) {
      return NextResponse.json({ error }, { status: 429 });
    }

    const body = await req.json();
    const { userId, linkId, eventType, username } = body;

    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';
    const country = getCountryFromHeaders(headerList as any);
    const { device, browser, os } = parseUserAgent(userAgent);
    const referrer = body.referrer || headerList.get('referer') || 'direct';
    const sessionId = body.sessionId || ip;

    // If no userId but username provided, look up the user
    let resolvedUserId = userId;
    if (!resolvedUserId && username) {
      const profile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username))
        .limit(1);

      if (profile.length > 0) {
        resolvedUserId = profile[0].userId;
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json({ success: true });
    }

    // Insert analytics record
    try {
      await db.insert(analytics).values({
        userId: resolvedUserId,
        linkId: linkId || null,
        eventType: eventType || 'view',
        device,
        country,
        referrer: referrer.substring(0, 255),
        userAgent: userAgent.substring(0, 500),
        ip: ip.substring(0, 50),
        sessionId,
      });
    } catch (dbErr) {
      console.error('Analytics DB error:', dbErr);
    }

    // Check for milestones (only for view events)
    if (eventType === 'view' || !eventType) {
      // Async - don't block the response
      (async () => {
        try {
          const milestone = await checkMilestones(resolvedUserId);
          if (milestone) {
            await sendMilestoneEmail(resolvedUserId, milestone);
            await trackMilestone(resolvedUserId, milestone);
          }
        } catch (err) {
          console.error('Milestone check failed:', err);
        }
      })();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ success: true });
  }
}
