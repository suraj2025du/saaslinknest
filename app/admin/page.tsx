'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, DollarSign, Settings, MessageSquare, Key, LogOut,
  Zap, ChevronRight, Menu, X, Bell, Search, Ban, Trash2, Eye,
  CheckCircle, XCircle, Loader2, TrendingUp, TrendingDown, Tag, FileText
} from 'lucide-react';
import CouponManagement from '@/components/admin/CouponManagement';
import BlogEditor from '@/components/admin/BlogEditor';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role === 'admin') {
          setUser(data.user);
          setLoading(false);
        } else {
          router.push('/dashboard');
        }
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full shadow-2xl shadow-brand-primary/20"
        />
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'blog', label: 'Blog Editor', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface-950 flex font-sans selection:bg-brand-primary/30 selection:text-white">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface-900 border-r border-white/5 transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30 relative group">
                <Zap className="text-white w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Admin Panel</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all relative group ${activeTab === tab.id
                  ? 'bg-red-500/10 text-red-500'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute left-0 w-1.5 h-6 bg-red-500 rounded-r-full"
                  />
                )}
                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-red-500' : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="p-4 rounded-2xl bg-surface-800 border border-white/5">
              <div className="text-sm font-black text-white truncate">{user.email}</div>
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Administrator</div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-500/10 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Topbar */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-12 glass sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-red-500 hover:bg-white/10 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-sm font-black text-slate-500">
              <span className="hover:text-white transition-colors cursor-pointer">Admin</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-white capitalize tracking-tight">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              User Dashboard
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === 'users' && <UsersModule />}
              {activeTab === 'revenue' && <RevenueModule />}
              {activeTab === 'coupons' && <CouponManagement />}
              {activeTab === 'blog' && <BlogEditor />}
              {activeTab === 'feedback' && <FeedbackModule />}
              {activeTab === 'settings' && <PlatformSettingsModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Users Module
function UsersModule() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?page=${page}&limit=20&search=${search}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleBanUser = async (userId: number, banned: boolean) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, banned }),
    });
    fetchUsers();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">User Management</h2>
          <p className="text-slate-400 text-sm font-medium">{total} total users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>
      ) : (
        <div className="premium-card rounded-[2.5rem] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-6">Email</th>
                <th className="p-6">Name</th>
                <th className="p-6">Role</th>
                <th className="p-6">Status</th>
                <th className="p-6">Joined</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-white">{user.email}</td>
                  <td className="p-6 text-slate-400">{user.name || '-'}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleBanUser(user.id, !user.deletedAt)}
                        className="p-2 rounded-xl hover:bg-yellow-500/10 text-slate-400 hover:text-yellow-400 transition-all"
                        title={user.deletedAt ? 'Unban' : 'Ban'}
                      >
                        {user.deletedAt ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-20 text-slate-500">No users found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing page {page}</p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Revenue Module
function RevenueModule() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue?period=30')
      .then(res => res.json())
      .then(data => {
        setMetrics(data.metrics);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Revenue & Analytics</h2>
        <p className="text-slate-400 text-sm font-medium">Platform-wide metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: metrics?.totalUsers || 0, icon: Users, color: 'text-brand-primary' },
          { label: 'Premium Users', value: metrics?.premiumUsers || 0, icon: TrendingUp, color: 'text-green-400' },
          { label: 'MRR', value: `$${(metrics?.mrr || 0).toFixed(2)}`, icon: DollarSign, color: 'text-brand-secondary' },
          { label: 'Total Views', value: metrics?.totalViews || 0, icon: Eye, color: 'text-brand-accent' },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-8 rounded-[2.5rem]">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="premium-card p-10 rounded-[3rem]">
        <h3 className="text-xl font-black text-white mb-6">Conversion Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-black text-brand-primary">{metrics?.conversionRate || 0}%</div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">View-to-Click Rate</div>
          </div>
          <div>
            <div className="text-4xl font-black text-brand-secondary">{metrics?.totalClicks || 0}</div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">Total Clicks</div>
          </div>
          <div>
            <div className="text-4xl font-black text-brand-accent">{metrics?.lifetimeUsers || 0}</div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">Lifetime Plans</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feedback Module
function FeedbackModule() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data.feedbacks || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (feedbackId: number, status: string) => {
    await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackId, status }),
    });
    setFeedbacks(feedbacks.map(f => f.id === feedbackId ? { ...f, status } : f));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">User Feedback</h2>
        <p className="text-slate-400 text-sm font-medium">{feedbacks.length} submissions</p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="premium-card p-6 rounded-[2rem]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${feedback.type === 'bug' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {feedback.type}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${feedback.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {feedback.status}
                  </span>
                </div>
                <p className="text-white font-medium mb-2">{feedback.message}</p>
                <p className="text-xs text-slate-500">{feedback.email || 'Anonymous'} • {new Date(feedback.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(feedback.id, 'resolved')}
                  className="p-2 rounded-xl hover:bg-green-500/10 text-slate-400 hover:text-green-400 transition-all"
                  title="Mark as resolved"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <div className="text-center py-20 text-slate-500">No feedback submissions</div>
        )}
      </div>
    </div>
  );
}

// Platform Settings Module
function PlatformSettingsModule() {
  const [settings, setSettings] = useState<any>({
    maintenanceMode: false,
    stripeEnabled: true,
    customDomainsEnabled: true,
  });
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      type: typeof value === 'boolean' ? 'boolean' : 'string',
    }));

    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Platform Settings</h2>
        <p className="text-slate-400 text-sm font-medium">Configure global platform settings</p>
      </div>

      <div className="premium-card p-10 rounded-[3rem] space-y-8">
        <div>
          <h3 className="text-lg font-black text-white mb-6">Feature Toggles</h3>
          <div className="space-y-6">
            {[
              { key: 'stripeEnabled', label: 'Stripe Payments', desc: 'Enable subscription payments' },
              { key: 'customDomainsEnabled', label: 'Custom Domains', desc: 'Allow users to add custom domains' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to users' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-6 rounded-2xl bg-white/5">
                <div>
                  <div className="text-sm font-black text-white">{setting.label}</div>
                  <div className="text-xs text-slate-500">{setting.desc}</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, [setting.key]: !settings[setting.key] })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${settings[setting.key] ? 'bg-green-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings[setting.key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
