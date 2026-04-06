import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, feedbacks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
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

// PATCH /api/admin/feedback - Update feedback status
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const { feedbackId, status } = body;

  if (!feedbackId || !status) {
    return NextResponse.json({ error: 'feedbackId and status required' }, { status: 400 });
  }

  await db
    .update(feedbacks)
    .set({ status })
    .where(eq(feedbacks.id, feedbackId));

  return NextResponse.json({ success: true });
}
