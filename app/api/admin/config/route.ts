import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, adminConfig, feedbacks, contactSubmissions } from '@/lib/schema';
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

// GET /api/admin/config - Get all platform settings
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const configs = await db.select().from(adminConfig).orderBy(adminConfig.key);

  // Also get feedback and contact submissions count
  const [feedbacksList, contactSubmissionsList] = await Promise.all([
    db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt)).limit(50),
    db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(50),
  ]);

  return NextResponse.json({
    config: configs,
    feedbacks: feedbacksList,
    contactSubmissions: contactSubmissionsList,
  });
}

// PATCH /api/admin/config - Update platform settings
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const { updates } = body; // Array of { key, value, type }

  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: 'updates must be an array' }, { status: 400 });
  }

  for (const update of updates) {
    const { key, value, type, encrypted } = update;
    
    if (!key || value === undefined) {
      continue;
    }

    // Check if exists
    const existing = await db
      .select()
      .from(adminConfig)
      .where(eq(adminConfig.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(adminConfig)
        .set({ value: String(value), type: type || 'string', encrypted: encrypted || false })
        .where(eq(adminConfig.key, key));
    } else {
      await db.insert(adminConfig).values({
        key,
        value: String(value),
        type: type || 'string',
        encrypted: encrypted || false,
      });
    }
  }

  return NextResponse.json({ success: true });
}
