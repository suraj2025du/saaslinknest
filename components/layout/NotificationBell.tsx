'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/notifications?unread=true&limit=1')
      .then((res) => res.json())
      .then((data) => {
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const handleNotificationRead = (ids: number[]) => {
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationIds: ids }),
    }).catch(() => {});

    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={handleNotificationClick}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all relative group"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-brand-primary rounded-full text-[10px] font-black text-white shadow-lg shadow-brand-primary/50 border-2 border-surface-900"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown
            onClose={() => setIsOpen(false)}
            onMarkAllRead={handleMarkAllRead}
            onNotificationRead={handleNotificationRead}
            onUnreadCountChange={setUnreadCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
