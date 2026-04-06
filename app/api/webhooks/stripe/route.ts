import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions, users, invoices, coupons } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import Stripe from 'stripe';
import { sendEmail, subscriptionConfirmationEmail, paymentFailedEmail } from '@/lib/email';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle checkout session completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const couponId = session.metadata?.couponId;

    // Increment coupon usedCount if a coupon was applied
    if (couponId) {
      const parsedCouponId = parseInt(couponId);
      if (!isNaN(parsedCouponId)) {
        await db
          .update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(eq(coupons.id, parsedCouponId));
      }
    }

    if (userId && plan) {
      // Get or create stripe customer
      const customer = await db.query.users.findFirst({
        where: eq(users.id, parseInt(userId)),
      });

      if (!customer) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update stripe customer ID if not set
      if (!customer.stripeCustomerId && session.customer) {
        await db.update(users)
          .set({ stripeCustomerId: session.customer as string })
          .where(eq(users.id, parseInt(userId)));
      }

      // Handle lifetime plan (one-time payment)
      if (plan === 'lifetime') {
        const existingSub = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.userId, parseInt(userId)),
        });

        const subData = {
          userId: parseInt(userId),
          plan: 'lifetime' as const,
          status: 'active' as const,
          stripeSubscriptionId: session.id, // Use session ID for lifetime
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date('2099-12-31'), // Far future
          cancelAtPeriodEnd: false,
        };

        if (existingSub) {
          await db.update(subscriptions).set(subData).where(eq(subscriptions.id, existingSub.id));
        } else {
          await db.insert(subscriptions).values(subData);
        }

        // Send confirmation email
        if (customer.email) {
          const { subject, html, text } = subscriptionConfirmationEmail('lifetime');
          sendEmail({ to: customer.email, subject, html, text }).catch(err =>
            console.error('Failed to send lifetime confirmation email:', err)
          );
        }
      } else {
        // Subscription plan - retrieve subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const subData = {
          userId: parseInt(userId),
          plan: plan as any,
          status: 'active' as const,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        };

        const existingSub = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.userId, parseInt(userId)),
        });

        if (existingSub) {
          await db.update(subscriptions).set(subData).where(eq(subscriptions.id, existingSub.id));
        } else {
          await db.insert(subscriptions).values(subData);
        }

        // Send confirmation email
        if (customer.email) {
          const { subject, html, text } = subscriptionConfirmationEmail(plan);
          sendEmail({ to: customer.email, subject, html, text }).catch(err =>
            console.error('Failed to send subscription confirmation email:', err)
          );
        }
      }
    }
  }

  // Handle subscription updated
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;

    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, subscription.id),
    });

    if (sub) {
      await db.update(subscriptions)
        .set({
          status: subscription.status === 'active' ? 'active' : 'expired',
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        })
        .where(eq(subscriptions.id, sub.id));
    }
  }

  // Handle subscription deleted
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;

    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, subscription.id),
    });

    if (sub) {
      await db.update(subscriptions)
        .set({
          status: 'cancelled',
          cancelAtPeriodEnd: false,
        })
        .where(eq(subscriptions.id, sub.id));
    }
  }

  // Handle invoice payment (for recording invoices)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    // Find user by stripe customer ID
    const user = await db.query.users.findFirst({
      where: eq(users.stripeCustomerId, customerId),
    });

    if (user) {
      await db.insert(invoices).values({
        userId: user.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency || 'usd',
        status: invoice.status || 'paid',
        url: invoice.hosted_invoice_url,
      });
    }
  }

  // Handle invoice payment failed
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const user = await db.query.users.findFirst({
      where: eq(users.stripeCustomerId, customerId),
    });

    if (user) {
      await db.insert(invoices).values({
        userId: user.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency || 'usd',
        status: 'failed',
        url: invoice.hosted_invoice_url,
      });

      // Send payment failed notification email
      if (user.email) {
        const { subject, html, text } = paymentFailedEmail(user.name || user.email.split('@')[0], invoice.amount_due);
        sendEmail({ to: user.email, subject, html, text }).catch(err =>
          console.error('Failed to send payment failed email:', err)
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
