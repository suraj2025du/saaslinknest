import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, coupons } from '@/lib/schema';
import { eq, desc, count, sql, and, or, like } from 'drizzle-orm';
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

  return { userId: session.userId as number, user };
}

// GET /api/admin/coupons - List all coupons
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search');
  const activeFilter = searchParams.get('active');

  const conditions = [];

  if (search) {
    conditions.push(like(coupons.code, `%${search}%`));
  }

  if (activeFilter !== null && activeFilter !== '' && activeFilter !== 'all') {
    conditions.push(eq(coupons.active, activeFilter === 'true'));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const [couponsList, totalResult] = await Promise.all([
    db
      .select()
      .from(coupons)
      .where(whereClause)
      .orderBy(desc(coupons.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(coupons).where(whereClause),
  ]);

  return NextResponse.json({
    coupons: couponsList,
    total: totalResult[0].count,
    page,
    limit,
  });
}

// POST /api/admin/coupons - Create a new coupon
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const { code, discountType, discountValue, maxUses, validFrom, validUntil, active } = body;

  if (!code || discountValue === undefined) {
    return NextResponse.json({ error: 'code and discountValue are required' }, { status: 400 });
  }

  if (!['percentage', 'fixed'].includes(discountType)) {
    return NextResponse.json({ error: 'Invalid discountType' }, { status: 400 });
  }

  if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
    return NextResponse.json({ error: 'Percentage discount must be between 0 and 100' }, { status: 400 });
  }

  try {
    const result = await db.insert(coupons).values({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      maxUses: maxUses || null,
      usedCount: 0,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      active: active !== undefined ? active : true,
    });

    return NextResponse.json({ success: true, couponId: (result as any).insertId });
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('Create coupon error:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
