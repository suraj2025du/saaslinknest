'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings as SettingsIcon,
  CreditCard,
  LogOut,
  Zap,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Users,
  Search,
  Bell,
  Crown,
  ArrowUpRight,
  Moon,
  Sun,
  Shield,
  Globe
} from 'lucide-react';

// --- Dashboard Modules ---
import { LinksModule } from '@/components/dashboard/LinksModule';
import { AppearanceModule } from '@/components/dashboard/AppearanceModule';
import { AnalyticsModule } from '@/components/dashboard/AnalyticsModule';
import { SettingsModule } from '@/components/dashboard/SettingsModule';
import { BillingModule } from '@/components/dashboard/BillingModule';
import { TeamManagement } from '@/components/dashboard/TeamManagement';
import { NotificationBell } from '@/components/layout/NotificationBell';

// --- Animated Background Orbs ---
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 100, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, 70, -30, 0],
          y: [0, -50, 90, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full opacity-[0.04] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
      />
    </div>
  );
}

// --- Animated Sidebar Logo ---
function AnimatedLogo() {
  return (
    <div className="relative">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-11 h-11 rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #06B6D4 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-xy 4s ease infinite',
        }}
      >
        <Zap className="text-white w-6 h-6 fill-white relative z-10" />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white/20"
        />
      </motion.div>
      <motion.div
        animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -inset-2 rounded-3xl bg-brand-primary/20 blur-xl -z-10"
      />
    </div>
  );
}

// --- Sidebar Navigation Item ---
function NavItem({
  tab,
  isActive,
  onClick,
  index,
}: {
  tab: { id: string; label: string; icon: React.ElementType; badge?: string };
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = tab.icon;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      className="w-full group relative"
    >
      <div
        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${isActive
            ? 'text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
      >
        {/* Active background */}
        {isActive && (
          <motion.div
            layoutId="sidebarActiveBg"
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)',
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}

        {/* Active left border */}
        {isActive && (
          <motion.div
            layoutId="sidebarActiveBorder"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style={{
              background: 'linear-gradient(180deg, #7C3AED, #EC4899)',
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}

        {/* Icon with glow */}
        <div className="relative z-10">
          <Icon
            className={`w-5 h-5 transition-all duration-300 ${isActive
                ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]'
                : 'group-hover:text-brand-primary/70'
              }`}
          />
        </div>

        {/* Label */}
        <span className="relative z-10">{tab.label}</span>

        {/* Badge */}
        {tab.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 ml-auto px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            }}
          >
            {tab.badge}
          </motion.span>
        )}

        {/* Hover shimmer */}
        <motion.div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
          }}
        />
      </div>
    </motion.button>
  );
}

// --- User Profile Card in Sidebar ---
function UserProfileCard({ user }: { user: any }) {
  const initial = user?.email?.[0]?.toUpperCase() || 'U';
  const username = user?.email?.split('@')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-4 rounded-2xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(124, 58, 237, 0.15)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 rounded-2xl"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(124, 58, 237, 0.15), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
          }}
        >
          {initial}
          <motion.div
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/30"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{username}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Free Plan</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Sidebar ---
function Sidebar({
  user,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}: {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}) {
  const tabs = [
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : undefined }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transition-all duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(11, 15, 26, 0.99) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Gradient overlay at top */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.08), transparent 70%)',
          }}
        />

        <div className="h-full flex flex-col p-6 relative z-10">
          {/* Logo + close */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <AnimatedLogo />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-black tracking-tight text-white"
              >
                Link
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  }}
                >
                  Nest
                </span>
              </motion.span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin">
            {tabs.map((tab, index) => (
              <NavItem
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                index={index}
              />
            ))}
          </nav>

          {/* Bottom section */}
          <div className="pt-6 space-y-4">
            <UserProfileCard user={user} />

            {/* Upgrade CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.35)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124, 58, 237, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%)',
                }}
              />
              <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-300 group"
            >
              <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform duration-300" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// --- Top Header Bar ---
function HeaderBar({
  activeTab,
  user,
  setIsSidebarOpen,
}: {
  activeTab: string;
  user: any;
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="h-16 lg:h-[72px] border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30"
      style={{
        background: 'rgba(11, 15, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Left: menu + breadcrumbs */}
      <div className="flex items-center gap-4 lg:gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-brand-primary hover:bg-white/[0.08] transition-all"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer hidden sm:inline">
            Dashboard
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
          <motion.span
            key={activeTab}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold capitalize text-white tracking-tight"
          >
            {activeTab}
          </motion.span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search bar */}
        <motion.div
          animate={{
            width: searchFocused ? 280 : 220,
            borderColor: searchFocused ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.08)',
          }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-white/[0.03] transition-colors"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-slate-500 bg-white/[0.06] border border-white/10">
            /
          </kbd>
        </motion.div>

        {/* My Profile link */}
        <motion.a
          href={`/creator`}
          target="_blank"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-bold text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/15 transition-all"
        >
          <span>My Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.a>

        {/* Admin panel (if admin) */}
        {user?.role === 'admin' && (
          <motion.a
            href="/admin"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-sm font-bold text-red-400 hover:bg-red-500/[0.15] transition-all"
          >
            Admin
          </motion.a>
        )}

        {/* Notification bell */}
        <NotificationBell />
      </div>
    </header>
  );
}

// --- Tab Bar (top of content) ---
function TabBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-2xl overflow-x-auto scrollbar-none"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-brand-primary' : ''}`} />
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// --- Welcome Header ---
function WelcomeHeader({ user, activeTab }: { user: any; activeTab: string }) {
  const username = user?.email?.split('@')[0] || 'User';

  const tabDescriptions: Record<string, string> = {
    links: 'Manage and organize all your links',
    appearance: 'Customize the look and feel of your page',
    analytics: 'Track performance and visitor insights',
    team: 'Manage your team members and permissions',
    settings: 'Configure your account preferences',
    billing: 'View your plan, usage, and invoices',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          <Sparkles className="w-5 h-5 text-brand-primary" />
        </motion.div>
        <motion.span
          className="text-xs font-bold uppercase tracking-widest text-slate-500"
        >
          Dashboard
        </motion.span>
      </div>

      <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
        <span className="text-white">Welcome back, </span>
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #06B6D4 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-xy 4s ease infinite',
          }}
        >
          {username}
        </span>
      </h1>

      <p className="text-slate-500 text-sm lg:text-base">
        {tabDescriptions[activeTab] || 'Your command center'}
      </p>
    </motion.div>
  );
}

// --- Main Dashboard Page ---
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('links');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden">
        {/* Loading background */}
        <BackgroundOrbs />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          {/* Animated logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center"
            style={{
              background: 'conic-gradient(from 0deg, #7C3AED, #EC4899, #06B6D4, #7C3AED)',
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-950 flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-primary" />
            </div>
          </motion.div>

          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-500 text-sm font-medium"
          >
            Loading your workspace...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex font-sans selection:bg-brand-primary/30 selection:text-white relative overflow-hidden"
      style={{ background: '#0B0F1A' }}
    >
      {/* Animated background orbs */}
      <BackgroundOrbs />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <HeaderBar
          activeTab={activeTab}
          user={user}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Welcome header */}
          <WelcomeHeader user={user} activeTab={activeTab} />

          {/* Tab bar */}
          <div className="mb-8">
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Module content with transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeTab === 'links' && <LinksModule user={user} />}
              {activeTab === 'appearance' && <AppearanceModule user={user} />}
              {activeTab === 'analytics' && <AnalyticsModule />}
              {activeTab === 'team' && <TeamManagement user={user} />}
              {activeTab === 'settings' && <SettingsModule user={user} />}
              {activeTab === 'billing' && <BillingModule user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
