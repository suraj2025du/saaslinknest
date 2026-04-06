import Stripe from 'stripe';

// Only throw in runtime, not during build
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_buildtime_placeholder';
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-01-27-preview',
  typescript: true,
});
