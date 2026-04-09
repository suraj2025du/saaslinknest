import { db } from '@/lib/db';
import { users, subscriptions, invoices, feedbacks, contactSubmissions, newsletterSubscribers } from '@/lib/schema';
import { count, eq, sum, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Users, DollarSign, CreditCard, TrendingUp, MessageSquare, Mail, ArrowRight, Zap } from 'lucide-react';

// Force dynamic rendering to prevent build-time database access errors
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalUsers = await db.select({ count: count() }).from(users);
  const activeSubs = await db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, 'active'));
  const totalRevenue = await db.select({ total: sum(invoices.amount) }).from(invoices);
  const pendingFeedbacks = await db.select({ count: count() }).from(feedbacks).where(eq(feedbacks.status as any, 'pending'));
  const contactCount = await db.select({ count: count() }).from(contactSubmissions);
  const subscriberCount = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.subscribed, true));

  const stats = {
    users: totalUsers[0]?.count || 0,
    activeSubs: activeSubs[0]?.count || 0,
    revenue: totalRevenue[0]?.total || 0,
    pendingFeedbacks: pendingFeedbacks[0]?.count || 0,
    contacts: contactCount[0]?.count || 0,
    subscribers: subscriberCount[0]?.count || 0,
  };

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-[#7C3AED] to-[#EC4899]', href: '/admin/users' },
    { label: 'Active Subscriptions', value: stats.activeSubs, icon: CreditCard, color: 'from-[#06B6D4] to-[#10B981]', href: '/admin/transactions' },
    { label: 'Total Revenue', value: `$${((stats.revenue as number || 0) / 100).toFixed(2)}`, icon: DollarSign, color: 'from-[#F59E0B] to-[#EC4899]', href: '/admin/revenue' },
    { label: 'Pending Feedbacks', value: stats.pendingFeedbacks, icon: MessageSquare, color: 'from-[#8B5CF6] to-[#06B6D4]', href: '/admin/feedback' },
    { label: 'Contact Requests', value: stats.contacts, icon: Zap, color: 'from-[#EC4899] to-[#7C3AED]', href: '/admin/feedback' },
    { label: 'Newsletter Subs', value: stats.subscribers, icon: Mail, color: 'from-[#10B981] to-[#06B6D4]', href: '/admin/newsletter' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2 font-medium">Welcome back, Admin. Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link href={card.href} key={i} className="group premium-card-glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{card.value}</div>
            <div className="text-sm text-slate-400 font-bold">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="premium-card-glass p-8 rounded-3xl border border-white/5">
        <h2 className="text-xl font-black text-white mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Manage Payments', desc: 'Add Stripe/Razorpay keys', href: '/admin/payments', color: 'text-[#7C3AED]' },
            { label: 'Create Coupon', desc: 'New discount code', href: '/admin/coupons', color: 'text-[#EC4899]' },
            { label: 'Edit Pricing', desc: 'Update plan prices', href: '/admin/pricing', color: 'text-[#06B6D4]' },
            { label: 'Blog Posts', desc: 'Create or edit posts', href: '/admin/blog', color: 'text-[#F59E0B]' },
          ].map((action, i) => (
            <Link href={action.href} key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
              <div className={`font-black text-lg mb-1 ${action.color}`}>{action.label}</div>
              <div className="text-xs text-slate-400 font-medium">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
