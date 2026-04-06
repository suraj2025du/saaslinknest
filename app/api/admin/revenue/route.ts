import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, subscriptions, analytics } from '@/lib/schema';
import { eq, count, sum, sql, gte, lte } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

async function requireAdmin() {
  const session = await getSession();
  if (!session?.userId) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId as number),
  });

  if (user?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { userId: session.userId as number };
}

// GET /api/admin/revenue - Get revenue metrics
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || '30'; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  try {
    // Get subscription metrics
    const [totalUsers, premiumSubscriptions, lifetimeSubscriptions] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.plan, 'premium')),
      db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.plan, 'lifetime')),
    ]);

    // MRR (Monthly Recurring Revenue) - estimate from premium subscriptions
    const premiumCount = premiumSubscriptions[0].count;
    const estimatedMRR = premiumCount * 2.99; // $2.99/month

    // Total revenue (lifetime payments)
    const lifetimeCount = lifetimeSubscriptions[0].count;
    const estimatedLifetimeRevenue = lifetimeCount * 49; // $49 one-time

    // Platform analytics
    const [totalViews, totalClicks] = await Promise.all([
      db.select({ count: count() }).from(analytics).where(eq(analytics.eventType, 'view')),
      db.select({ count: count() }).from(analytics).where(eq(analytics.eventType, 'click')),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers: totalUsers[0].count,
        premiumUsers: premiumCount,
        lifetimeUsers: lifetimeCount,
        mrr: estimatedMRR,
        arr: estimatedMRR * 12,
        lifetimeRevenue: estimatedLifetimeRevenue,
        totalViews: totalViews[0].count,
        totalClicks: totalClicks[0].count,
        conversionRate: totalViews[0].count > 0 
          ? ((totalClicks[0].count / totalViews[0].count) * 100).toFixed(2) 
          : '0',
      },
    });
  } catch (error) {
    console.error('Revenue metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue metrics' },
      { status: 500 }
    );
  }
}
