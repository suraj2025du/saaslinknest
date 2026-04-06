import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, subscriptions, coupons } from '@/lib/schema';
import { eq, or, isNull, lte, gte } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

async function validateAndApplyCoupon(code: string): Promise<{ couponId?: string; error?: string }> {
  if (!code) return {};

  const now = new Date();
  const coupon = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.toUpperCase().trim()))
    .limit(1);

  if (coupon.length === 0) {
    return { error: 'Invalid coupon code' };
  }

  const found = coupon[0];

  if (!found.active) return { error: 'This coupon is no longer active' };
  if (found.validFrom && new Date(found.validFrom) > now) return { error: 'This coupon is not yet valid' };
  if (found.validUntil && new Date(found.validUntil) < now) return { error: 'This coupon has expired' };
  if (found.maxUses !== null && (found.usedCount ?? 0) >= found.maxUses) return { error: 'This coupon has reached its usage limit' };

  // Create a Stripe coupon on the fly for this internal coupon
  // We store the Stripe coupon ID in a separate field or create one if needed
  // For now, we return the internal coupon details and let the webhook handle discount tracking
  return { couponId: String(found.id) };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, couponCode } = body;

    // Validate plan
    if (!['premium', 'lifetime'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId as number))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate coupon if provided
    let discountAmount: { percent_off?: number; amount_off?: number } | undefined;
    let validatedCouponId: string | undefined;

    if (couponCode) {
      const result = await validateAndApplyCoupon(couponCode);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      validatedCouponId = result.couponId;

      // Fetch coupon details to compute discount
      const coupon = await db
        .select()
        .from(coupons)
        .where(eq(coupons.id, parseInt(validatedCouponId!)))
        .limit(1);

      if (coupon.length > 0) {
        const c = coupon[0];
        if (c.discountType === 'percentage') {
          discountAmount = { percent_off: c.discountValue };
        } else {
          discountAmount = { amount_off: c.discountValue };
        }
      }
    }

    // Price IDs (replace with your actual Stripe price IDs)
    const priceIds: Record<string, string> = {
      premium: process.env.STRIPE_PREMIUM_PRICE_ID || '',
      lifetime: process.env.STRIPE_LIFETIME_PRICE_ID || '',
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    // Build line items - apply discount if coupon is valid
    const lineItems: any[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // If there's a fixed discount, we apply it as a discount line item
    // For percentage discounts, Stripe's promotion_codes handle it better
    // but we can also manually adjust via discounts array
    let discounts: any[] | undefined;
    if (discountAmount) {
      if (discountAmount.percent_off) {
        discounts = [{ coupon: { percent_off: discountAmount.percent_off } }];
      } else if (discountAmount.amount_off) {
        discounts = [{ coupon: { amount_off: discountAmount.amount_off, currency: 'usd' } }];
      }
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: user[0].stripeCustomerId || undefined,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?tab=billing&success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/dashboard?tab=billing&canceled=true`,
      metadata: {
        userId: user[0].id.toString(),
        plan,
        couponCode: couponCode || '',
        couponId: validatedCouponId || '',
      },
      customer_email: user[0].email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      ...(discounts && discounts.length > 0 ? { discounts } : {}),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.userId as number))
      .limit(1);

    if (subscription.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({ subscription: subscription[0] });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}
