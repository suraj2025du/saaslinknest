import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles, subscriptions, analytics, feedbacks, contactSubmissions, adminConfig } from '@/lib/schema';
import { eq, desc, count, sql, and, or, gte, lte, like } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// Middleware: check admin role
async function requireAdmin() {
  const session = await getSession();
  if (!session?.userId) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId as number),
  });

  if (user?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { userId: session.userId as number, user };
}

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search');
  let sort = searchParams.get('sort') || 'createdAt';
  let order = searchParams.get('order') || 'desc';

  // SECURITY: Whitelist allowed sort columns and directions to prevent SQL injection
  const ALLOWED_SORTS = ['createdAt', 'email', 'name', 'role', 'lastSignedIn'];
  const ALLOWED_ORDERS = ['asc', 'desc'];
  if (!ALLOWED_SORTS.includes(sort)) sort = 'createdAt';
  if (!ALLOWED_ORDERS.includes(order)) order = 'desc';

  let whereClause = sql`1=1`;

  if (search) {
    const searchTerm = `%${search}%`;
    whereClause = and(
      like(users.email, searchTerm),
      or(like(users.name, searchTerm), sql`1=1`)
    ) as any;
  }

  const offset = (page - 1) * limit;

  const [usersList, totalResult] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        loginMethod: users.loginMethod,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(whereClause)
      .orderBy(sql`${sql.raw(sort)} ${sql.raw(order)}`)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  return NextResponse.json({
    users: usersList,
    total: totalResult[0].count,
    page,
    limit,
  });
}

// PATCH /api/admin/users - Update user (ban, change role, etc.)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const { userId, role, banned } = body;

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const updateData: any = {};
  if (role) updateData.role = role;
  if (banned !== undefined) updateData.deletedAt = banned ? new Date() : null;

  await db.update(users).set(updateData).where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/users - Delete user
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get('userId') || '0');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  await db.delete(users).where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
