import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const baseCondition = eq(notifications.userId, session.userId as number);

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(unreadOnly ? and(baseCondition, eq(notifications.read, false)) : baseCondition)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Get unread count
    const unreadResult = await db
      .select({ count: notifications.id })
      .from(notifications)
      .where(and(baseCondition, eq(notifications.read, false)));

    const unreadCount = unreadResult.length;

    return NextResponse.json({
      notifications: userNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}

// POST - Create a new notification (typically called by admin/system or webhooks)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, message, type, link, targetUserId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const validTypes = ['info', 'warning', 'success', 'error'];
    const notificationType = validTypes.includes(type) ? type : 'info';

    // Allow creating notifications for other users (e.g., admin actions)
    // Otherwise default to current user
    const userId = targetUserId || session.userId;

    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId: userId as number,
        title,
        message,
        type: notificationType,
        link: link || null,
        read: false,
      })
      .$returningId();

    return NextResponse.json({
      success: true,
      notification: { id: newNotification.id, title, message, type: notificationType, link },
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationIds } = body;

    const baseCondition = eq(notifications.userId, session.userId as number);

    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Mark specific notifications as read
      await db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            baseCondition,
            or(...notificationIds.map((id: number) => eq(notifications.id, id)))
          )
        );
    } else {
      // Mark all as read
      await db
        .update(notifications)
        .set({ read: true })
        .where(baseCondition);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (notificationId) {
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, session.userId as number)
          )
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
