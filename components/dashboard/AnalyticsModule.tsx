'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer2,
  Target,
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Search,
  Monitor,
  Tablet,
  Filter,
  ChevronDown,
  Link as LinkIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-card-gloss p-4 rounded-2xl border-white/10 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-white">
          {payload[0].value.toLocaleString()} <span className="text-xs text-brand-primary">Views</span>
        </p>
      </div>
    );
  }
  return null;
};

interface AnalyticsData {
  stats: Array<{
    label: string;
    value: string;
    trend: string;
    icon: any;
    color: string;
  }>;
  chartData: Array<{
    date: string;
    views: number;
  }>;
  countries: Array<{
    country: string;
    views: string;
    percent: number;
    flag: string;
  }>;
  devices: Array<{
    device: string;
    views: number;
    percent: number;
  }>;
  topDevice: {
    device: string;
    percent: number;
  } | null;
  topLinks: Array<{
    title: string;
    url: string;
    clicks: number;
  }>;
}

export const AnalyticsModule = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedLink, setSelectedLink] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [userLinks, setUserLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        if (Array.isArray(data)) {
          setUserLinks(data);
        }
      } catch (error) {
        console.error('Failed to fetch links:', error);
      }
    };
    fetchUserLinks();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          range: dateRange,
          linkId: selectedLink,
          country: selectedCountry,
          device: selectedDevice,
        });
        const res = await fetch(`/api/analytics?${params.toString()}`);
        const result = await res.json();

        // Map icons back because they are lost in JSON
        if (result.stats) {
          result.stats = result.stats.map((s: any) => {
            if (s.label === 'Total Views') s.icon = Eye;
            if (s.label === 'Total Clicks') s.icon = MousePointer2;
            if (s.label === 'Avg. CTR') s.icon = Target;
            if (s.label === 'Conversion') s.icon = Users;
            return s;
          });
        }

        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange, selectedLink, selectedCountry, selectedDevice]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Analytics</h2>
          <p className="text-slate-400 text-sm font-medium">Deep dive into your profile performance and audience insights.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="relative group">
            <select
              value={dateRange}
              onChange={(e) => {
                setIsLoading(true);
                setDateRange(e.target.value);
              }}
              className="appearance-none bg-surface-900 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-xs font-black text-white uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/50 hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Device Filter */}
          <div className="relative group">
            <select
              value={selectedDevice}
              onChange={(e) => {
                setIsLoading(true);
                setSelectedDevice(e.target.value);
              }}
              className="appearance-none bg-surface-900 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-xs font-black text-white uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/50 hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
            </select>
            <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black hover:bg-brand-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20 uppercase tracking-widest">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Secondary Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">
          <Filter className="w-3 h-3" />
          Quick Filters:
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400">Link:</span>
          <select
            value={selectedLink}
            onChange={(e) => {
              setIsLoading(true);
              setSelectedLink(e.target.value);
            }}
            className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:text-brand-primary transition-colors"
          >
            <option value="all">All Links</option>
            {userLinks.map(link => (
              <option key={link.id} value={link.id}>{link.title}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-4 bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setIsLoading(true);
              setSelectedCountry(e.target.value);
            }}
            className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:text-brand-primary transition-colors"
          >
            <option value="all">All Countries</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading || !data ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[600px] flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full shadow-2xl shadow-brand-primary/20"
            />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Updating Analytics...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.stats.map((stat: any, i: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card-gloss p-6 rounded-[2rem] group hover:border-brand-primary/30 transition-all relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${stat.color.replace('text-', 'bg-')}`} />

                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>

                  <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 premium-card p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Traffic Over Time</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Daily profile views</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Views</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-brand-primary)', strokeWidth: 2, strokeDasharray: '5 5' }} />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="var(--color-brand-primary)"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="premium-card p-8 rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-white tracking-tight mb-8">Top Countries</h3>
                  <div className="space-y-6">
                    {data.countries.map((c: any) => (
                      <div key={c.country} className="space-y-2">
                        <div className="flex justify-between text-sm font-black">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{c.flag}</span>
                            <span className="text-slate-300">{c.country}</span>
                          </div>
                          <span className="text-white">{c.views}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.percent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    {data.countries.length === 0 && (
                      <div className="py-12 text-center">
                        <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No data for this filter</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                    View All Countries
                  </button>
                </div>

                <div className="premium-card p-8 rounded-[2.5rem] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Top Device</h4>
                    <div className="text-2xl font-black text-white capitalize">
                      {data?.topDevice ? `${data.topDevice.device} (${data.topDevice.percent}%)` : 'N/A'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    {data?.topDevice?.device === 'desktop' ? <Monitor className="w-6 h-6" /> :
                      data?.topDevice?.device === 'tablet' ? <Tablet className="w-6 h-6" /> :
                        <Smartphone className="w-6 h-6" />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
