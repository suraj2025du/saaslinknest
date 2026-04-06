import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { analytics, links } from '@/lib/schema';
import { eq, and, gte, sql, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';
    const linkId = searchParams.get('linkId');
    const country = searchParams.get('country');
    const device = searchParams.get('device');

    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const baseWhere = [
      eq(analytics.userId, session.id as number),
      gte(analytics.timestamp, startDate)
    ];

    if (linkId && linkId !== 'all') baseWhere.push(eq(analytics.linkId, parseInt(linkId)));
    if (country && country !== 'all') baseWhere.push(eq(analytics.country, country));
    if (device && device !== 'all') baseWhere.push(eq(analytics.device, device as any));

    const whereClause = and(...baseWhere);

    // 1. Get total views and clicks
    const statsResult = await db.select({
      eventType: analytics.eventType,
      count: sql<number>`count(*)`
    })
      .from(analytics)
      .where(whereClause)
      .groupBy(analytics.eventType);

    const totalViews = statsResult.find(r => r.eventType === 'view')?.count || 0;
    const totalClicks = statsResult.find(r => r.eventType === 'click')?.count || 0;
    const ctr = totalViews > 0 ? ((totalClicks / (totalViews || 1)) * 100).toFixed(1) : '0.0';

    // 2. Get chart data (views over time)
    const chartResult = await db.select({
      date: sql<string>`DATE(${analytics.timestamp})`,
      views: sql<number>`count(*)`
    })
      .from(analytics)
      .where(and(whereClause, eq(analytics.eventType, 'view')))
      .groupBy(sql`DATE(${analytics.timestamp})`)
      .orderBy(sql`DATE(${analytics.timestamp})`);

    // 3. Get top countries
    const countriesResult = await db.select({
      country: analytics.country,
      views: sql<number>`count(*)`
    })
      .from(analytics)
      .where(and(whereClause, eq(analytics.eventType, 'view')))
      .groupBy(analytics.country)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const totalCountryViews = countriesResult.reduce((acc, curr) => acc + curr.views, 0);
    const countries = countriesResult.map(c => ({
      country: c.country,
      views: c.views.toLocaleString(),
      percent: totalCountryViews > 0 ? Math.round((c.views / totalCountryViews) * 100) : 0,
      flag: '📍' // Placeholder flag
    }));

    // 4. Get device breakdown
    const devicesResult = await db.select({
      device: analytics.device,
      views: sql<number>`count(*)`
    })
      .from(analytics)
      .where(and(whereClause, eq(analytics.eventType, 'view')))
      .groupBy(analytics.device)
      .orderBy(desc(sql`count(*)`));

    const totalDeviceViews = devicesResult.reduce((acc, curr) => acc + curr.views, 0);
    const devices = devicesResult.map(d => ({
      device: d.device || 'unknown',
      views: d.views,
      percent: totalDeviceViews > 0 ? Math.round((d.views / totalDeviceViews) * 100) : 0,
    }));

    // 5. Get top device
    const topDevice = devices.length > 0 ? devices[0] : null;

    // 6. Get top links by clicks
    const topLinksResult = await db.select({
      linkId: analytics.linkId,
      clicks: sql<number>`count(*)`
    })
      .from(analytics)
      .where(and(whereClause, eq(analytics.eventType, 'click'), sql`${analytics.linkId} IS NOT NULL`))
      .groupBy(analytics.linkId)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // Fetch link details
    const topLinks = await Promise.all(
      topLinksResult.map(async (l) => {
        if (l.linkId) {
          const link = await db.query.links.findFirst({
            where: eq(links.id, l.linkId as number),
          });
          return {
            title: link?.title || 'Unknown Link',
            url: link?.url || '',
            clicks: l.clicks,
          };
        }
        return null;
      })
    ).then(results => results.filter(Boolean));

    return NextResponse.json({
      stats: [
        { label: 'Total Views', value: totalViews.toLocaleString(), trend: '+0%', icon: 'Eye', color: 'text-brand-primary' },
        { label: 'Total Clicks', value: totalClicks.toLocaleString(), trend: '+0%', icon: 'MousePointer2', color: 'text-brand-secondary' },
        { label: 'Avg. CTR', value: `${ctr}%`, trend: '+0%', icon: 'Target', color: 'text-brand-accent' },
        { label: 'Conversion', value: '0%', trend: '+0%', icon: 'Users', color: 'text-emerald-500' },
      ],
      chartData: chartResult.map(r => ({
        date: r.date,
        views: r.views
      })),
      countries,
      devices,
      topDevice: topDevice ? {
        device: topDevice.device,
        percent: topDevice.percent,
      } : null,
      topLinks,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
