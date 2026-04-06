import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles, links, analytics, subscriptions, notifications, feedbacks } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId as number;

    // Soft delete: set deletedAt timestamp
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, userId));

    // Optionally, hard delete everything (uncomment if you want hard deletes)
    // await db.delete(analytics).where(eq(analytics.userId, userId));
    // await db.delete(links).where(eq(links.userId, userId));
    // await db.delete(profiles).where(eq(profiles.userId, userId));
    // await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    // await db.delete(notifications).where(eq(notifications.userId, userId));
    // await db.delete(feedbacks).where(eq(feedbacks.userId, userId));
    // await db.delete(users).where(eq(users.id, userId));

    // Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
