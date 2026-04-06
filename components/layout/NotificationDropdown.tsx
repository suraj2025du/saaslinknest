'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  link: string | null;
  createdAt: Date | string;
}

interface NotificationDropdownProps {
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationRead: (ids: number[]) => void;
  onUnreadCountChange: (count: number) => void;
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    iconColor: 'text-green-400',
    dotColor: 'bg-green-400',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
    dotColor: 'bg-red-400',
  },
};

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
}

export function NotificationDropdown({
  onClose,
  onMarkAllRead,
  onNotificationRead,
  onUnreadCountChange,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setLocalUnreadCount] = useState(0);
  const router = useRouter();

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    fetch('/api/notifications?limit=20')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLocalUnreadCount(data.unreadCount || 0);
        onUnreadCountChange(data.unreadCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [onUnreadCountChange]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setLocalUnreadCount(0);
      onUnreadCountChange(0);
      onMarkAllRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      const newCount = Math.max(0, unreadCount - 1);
      setLocalUnreadCount(newCount);
      onUnreadCountChange(newCount);
      onNotificationRead([notification.id]);
    }

    if (notification.link) {
      router.push(notification.link);
      onClose();
    }
  };

  const handleMarkSingleRead = async (
    e: React.MouseEvent,
    notificationId: number
  ) => {
    e.stopPropagation();
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      const newCount = Math.max(0, unreadCount - 1);
      setLocalUnreadCount(newCount);
      onUnreadCountChange(newCount);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="absolute right-0 top-full mt-3 w-[420px] max-w-[calc(100vw-2rem)] z-50"
    >
      <div className="premium-card-glass p-0 rounded-2xl border border-white/10 bg-surface-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-black">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-black"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Bell className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-white font-black text-sm">No notifications</p>
              <p className="text-slate-500 text-xs mt-1">
                You are all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification, index) => {
                const config = typeConfig[notification.type] || typeConfig.info;
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group px-5 py-4 cursor-pointer transition-all relative ${!notification.read
                      ? 'bg-white/5 hover:bg-white/8'
                      : 'hover:bg-white/3'
                      }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${config.dotColor} rounded-r-full`}
                      />
                    )}

                    <div className="flex items-start gap-3.5">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${config.iconColor}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-bold truncate ${!notification.read
                              ? 'text-white'
                              : 'text-slate-300'
                              }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) =>
                                handleMarkSingleRead(e, notification.id)
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all flex-shrink-0"
                              title="Mark as read"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-500 font-medium">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          {notification.link && (
                            <span className="flex items-center gap-1 text-[10px] text-brand-primary/70 font-medium">
                              Click to view
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
              {unreadCount} unread of {notifications.length} shown
            </p>
            <button
              onClick={() => {
                onClose();
              }}
              className="text-[10px] text-brand-primary font-black uppercase tracking-widest hover:text-brand-primary/80 transition-colors"
            >
              View all
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
