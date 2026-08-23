import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckSquare,
  Eye,
  Zap,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotificationStore } from '../../store/notificationStore';
import type { NotificationType, NotificationItem } from '../../types/notification';
import { cn } from '../../utils/cn';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  task: <CheckSquare className="h-4 w-4 text-purple-400" />,
  review: <Eye className="h-4 w-4 text-amber-400" />,
  sprint: <Zap className="h-4 w-4 text-emerald-400" />,
  system: <Radio className="h-4 w-4 text-sky-400" />,
};

const ITEMS_PER_PAGE = 5;

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount } = useNotifications();
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsDropdownOpen]);

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Open notifications"
        aria-expanded={isDropdownOpen}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#161822] transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0b0c10] shadow-sm animate-in zoom-in-50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#12141c] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-[#161824]/60">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 bg-[#0f1118]">
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                filter === 'all'
                  ? 'bg-[#222533] text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter('unread');
                setCurrentPage(1);
              }}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                filter === 'unread'
                  ? 'bg-[#222533] text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-white/5 max-h-[340px] overflow-y-auto">
            {paginatedItems.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs text-slate-500">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications available'}
              </div>
            ) : (
              paginatedItems.map((item: NotificationItem) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#181a26]',
                    !item.read ? 'bg-purple-950/20' : 'bg-transparent'
                  )}
                >
                  <div className="p-1.5 rounded-lg bg-[#1a1c28] border border-white/5 shrink-0 mt-0.5">
                    {typeIcons[item.type]}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          'text-xs font-semibold truncate',
                          !item.read ? 'text-white font-bold' : 'text-slate-300'
                        )}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with Pagination & Clear All */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-[#0f1118] text-[11px] text-slate-400">
            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear all</span>
              </button>
            ) : (
              <span />
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded bg-[#1a1d26] disabled:opacity-30 hover:text-white"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded bg-[#1a1d26] disabled:opacity-30 hover:text-white"
                  aria-label="Next"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
