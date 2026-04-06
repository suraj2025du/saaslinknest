'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CreditCard, CheckCircle2, ExternalLink, Loader2, Tag, X, CheckCircle, AlertCircle } from 'lucide-react';

interface BillingModuleProps {
  user: any;
}

interface ValidatedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export function BillingModule({ user }: BillingModuleProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [validatedCoupon, setValidatedCoupon] = useState<ValidatedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);

  useEffect(() => {
    fetch('/api/subscriptions/checkout')
      .then(res => res.json())
      .then(data => {
        setSubscription(data.subscription);
        setSubscriptionLoading(false);
      })
      .catch(() => setSubscriptionLoading(false));
  }, []);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    setCouponError('');
    setValidatedCoupon(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();

      if (data.valid) {
        setValidatedCoupon(data.coupon);
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setCouponValidating(false);
    }
  };

  const handleUpgrade = async (plan: 'premium' | 'lifetime') => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, couponCode: validatedCoupon?.code || couponCode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        setCouponError(data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    try {
      const res = await fetch('/api/subscriptions/billing-portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
    }
  };

  const clearCoupon = () => {
    setCouponCode('');
    setValidatedCoupon(null);
    setCouponError('');
  };

  const formatDiscount = (c: ValidatedCoupon) => {
    if (c.discountType === 'percentage') {
      return `${c.discountValue}% off`;
    }
    return `$${(c.discountValue / 100).toFixed(2)} off`;
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active';
  const isLifetime = subscription?.plan === 'lifetime' && subscription?.status === 'active';

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Billing</h2>
        <p className="text-slate-400 text-sm font-medium">Manage your subscription, invoices, and payment methods.</p>
      </div>

      {/* Current Plan */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {(isPremium || isLifetime) ? (
            <div className="premium-card-gloss p-10 rounded-[3rem] border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle2 className="w-24 h-24 text-brand-primary" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-500/20">
                  Active Plan
                </div>
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight capitalize">
                  {subscription.plan} Plan
                </h3>
                <p className="text-slate-400 text-lg font-medium mb-6">
                  {isLifetime ? 'Lifetime access - no recurring payments' : 'Your subscription is active and up to date'}
                </p>

                {subscription.currentPeriodEnd && (
                  <p className="text-slate-500 text-sm mb-8">
                    {isLifetime ? 'No expiration' : `Next billing date: ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleBillingPortal}
                    className="flex items-center gap-2 px-10 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                  >
                    <CreditCard className="w-5 h-5" />
                    Manage Billing
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Coupon Input */}
              <div className="premium-card-gloss p-6 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-brand-primary" />
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Have a coupon code?</h4>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        if (couponError) setCouponError('');
                        if (validatedCoupon) setValidatedCoupon(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleValidateCoupon();
                      }}
                      placeholder="Enter coupon code"
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 font-mono text-sm"
                    />
                    {validatedCoupon && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  {validatedCoupon || couponError ? (
                    <button
                      onClick={clearCoupon}
                      className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleValidateCoupon}
                      disabled={couponValidating || !couponCode.trim()}
                      className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-black text-sm hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {couponValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  )}
                </div>
                {validatedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 text-sm font-bold">Coupon applied!</p>
                      <p className="text-green-400/70 text-xs">You'll get {formatDiscount(validatedCoupon)} on your purchase.</p>
                    </div>
                  </motion.div>
                )}
                {couponError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm font-bold">{couponError}</p>
                  </motion.div>
                )}
              </div>

              <div className="premium-card-gloss p-10 rounded-[3rem] border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-24 h-24 text-brand-primary" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-primary/20">
                    Current Plan
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Free Starter</h3>
                  <p className="text-slate-400 text-lg font-medium mb-10 max-w-md">
                    You are currently using the free version of LinkNest. Upgrade to unlock premium features and custom domains.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleUpgrade('premium')}
                      disabled={loading}
                      className="bg-brand-primary text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/30 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Upgrade to Premium - $2.99/mo'
                      )}
                    </button>
                    <button
                      onClick={() => handleUpgrade('lifetime')}
                      disabled={loading}
                      className="px-10 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      Get Lifetime - $49
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card-gloss p-8 rounded-[2.5rem] space-y-6">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">
              {isPremium || isLifetime ? 'Your Benefits' : 'Premium Features'}
            </h4>
            <ul className="space-y-4">
              {[
                'Unlimited links',
                'Advanced analytics',
                isPremium || isLifetime ? 'All 10 themes' : '3 basic themes',
                'Custom domain support',
                'Remove LinkNest branding',
                'Priority support',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 mt-0.5 ${isPremium || isLifetime ? 'text-green-400' : 'text-slate-600'}`} />
                  <span className={`text-sm ${isPremium || isLifetime ? 'text-white' : 'text-slate-400'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
