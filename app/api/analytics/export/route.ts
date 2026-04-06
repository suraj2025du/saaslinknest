import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analytics, links } from '@/lib/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { analyticsToCSV, createCSVResponse } from '@/lib/analytics-export';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get analytics data
    const analyticsData = await db
      .select({
        timestamp: analytics.timestamp,
        eventType: analytics.eventType,
        device: analytics.device,
        country: analytics.country,
        referrer: analytics.referrer,
      })
      .from(analytics)
      .where(
        and(
          eq(analytics.userId, session.userId as number),
          gte(analytics.timestamp, startDate)
        )
      )
      .orderBy(analytics.timestamp);

    // Get link info for link-specific analytics
    const linkAnalytics = await db
      .select({
        timestamp: analytics.timestamp,
        eventType: analytics.eventType,
        device: analytics.device,
        country: analytics.country,
        referrer: analytics.referrer,
        linkTitle: links.title,
        linkUrl: links.url,
      })
      .from(analytics)
      .leftJoin(links, eq(analytics.linkId, links.id))
      .where(
        and(
          eq(analytics.userId, session.userId as number),
          gte(analytics.timestamp, startDate)
        )
      )
      .orderBy(analytics.timestamp);

    const csvData = linkAnalytics.map(row => ({
      timestamp: row.timestamp?.toISOString() || '',
      eventType: row.eventType || '',
      device: row.device || '',
      country: row.country || '',
      referrer: row.referrer || '',
      linkTitle: row.linkTitle || '',
      linkUrl: row.linkUrl || '',
    }));

    const csv = analyticsToCSV(csvData);
    const filename = `linknest-analytics-${new Date().toISOString().split('T')[0]}.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
