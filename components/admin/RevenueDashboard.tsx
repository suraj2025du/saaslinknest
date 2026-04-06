'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Users, CreditCard, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function RevenueDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch('/api/admin/revenue');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
          setChartData(data.chartData || []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchRevenue();
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading revenue data...</div>;

  const defaultMetrics = {
    mrr: 0, arr: 0, totalRevenue: 0, activeSubscriptions: 0, conversionRate: 0, churnRate: 0
  };
  const m = metrics || defaultMetrics;

  const defaultChartData = [
    { month: 'Jan', revenue: 1200 }, { month: 'Feb', revenue: 1800 }, { month: 'Mar', revenue: 2400 },
    { month: 'Apr', revenue: 3200 }, { month: 'May', revenue: 4100 }, { month: 'Jun', revenue: 5000 },
  ];
  const data = chartData.length > 0 ? chartData : defaultChartData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Revenue & Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Track MRR, ARR, and platform financial performance.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Monthly Revenue (MRR)', value: `$${m.mrr || 0}`, icon: DollarSign, color: 'from-[#7C3AED] to-[#EC4899]' },
          { label: 'Annual Revenue (ARR)', value: `$${m.arr || 0}`, icon: TrendingUp, color: 'from-[#06B6D4] to-[#10B981]' },
          { label: 'Active Subscriptions', value: m.activeSubscriptions || 0, icon: CreditCard, color: 'from-[#F59E0B] to-[#EC4899]' },
          { label: 'Conversion Rate', value: `${m.conversionRate || 0}%`, icon: Activity, color: 'from-[#8B5CF6] to-[#06B6D4]' },
        ].map((card, i) => (
          <div key={i} className="premium-card-glass p-6 rounded-3xl border border-white/5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-white">{card.value}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="premium-card-glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-lg font-black text-white mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fill="url(#colorRev)" strokeWidth={3} />
              <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} /><stop offset="95%" stopColor="#7C3AED" stopOpacity={0} /></linearGradient></defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card-glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-lg font-black text-white mb-6">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
