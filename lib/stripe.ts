import Stripe from 'stripe';

// SECURITY: Throw fatal error if Stripe key is missing in production
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: STRIPE_SECRET_KEY environment variable is required in production');
  }
  console.warn('⚠️ STRIPE_SECRET_KEY not set — Stripe features will be disabled');
}

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
    apiVersion: '2025-01-27-preview',
    typescript: true,
  })
  : null as unknown as Stripe; // Type-safe null for build-time
