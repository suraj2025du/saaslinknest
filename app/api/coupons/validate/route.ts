import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// POST /api/coupons/validate - Public endpoint to validate a coupon code
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const now = new Date();

    const couponResult = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase().trim()))
      .limit(1);

    if (couponResult.length === 0) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    const found = couponResult[0];

    // Check if active
    if (!found.active) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active' });
    }

    // Check validFrom
    if (found.validFrom && new Date(found.validFrom) > now) {
      return NextResponse.json({ valid: false, error: 'This coupon is not yet valid' });
    }

    // Check validUntil
    if (found.validUntil && new Date(found.validUntil) < now) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' });
    }

    // Check maxUses
    if (found.maxUses !== null && (found.usedCount ?? 0) >= found.maxUses) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: found.code,
        discountType: found.discountType,
        discountValue: found.discountValue,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
