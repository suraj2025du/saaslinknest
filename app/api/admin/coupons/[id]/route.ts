import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, coupons } from '@/lib/schema';
import { eq } from 'drizzle-orm';
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

// PATCH /api/admin/coupons/[id] - Update a coupon
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const couponId = parseInt(id);

  if (!couponId) {
    return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
  }

  const body = await req.json();
  const { code, discountType, discountValue, maxUses, validFrom, validUntil, active } = body;

  const existing = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }

  const updateData: Record<string, any> = {};
  if (code !== undefined) updateData.code = code.toUpperCase().trim();
  if (discountType !== undefined) updateData.discountType = discountType;
  if (discountValue !== undefined) updateData.discountValue = discountValue;
  if (maxUses !== undefined) updateData.maxUses = maxUses;
  if (validFrom !== undefined) updateData.validFrom = validFrom ? new Date(validFrom) : null;
  if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;
  if (active !== undefined) updateData.active = active;

  try {
    await db.update(coupons).set(updateData).where(eq(coupons.id, couponId));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('Update coupon error:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE /api/admin/coupons/[id] - Delete a coupon
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const couponId = parseInt(id);

  if (!couponId) {
    return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
  }

  const existing = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }

  await db.delete(coupons).where(eq(coupons.id, couponId));

  return NextResponse.json({ success: true });
}
