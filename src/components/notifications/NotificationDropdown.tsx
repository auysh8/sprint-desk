import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import type { NotificationItem, NotificationType } from '../../types/notification';
import { cn } from '../../utils/cn';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  task: <Layers className="h-3.5 w-3.5 text-sky-400" />,
  review: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
  system: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />,
  sprint: <Clock className="h-3.5 w-3.5 text-amber-400" />,
};

export const NotificationDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    loadInitialNotifications,
    setIsDropdownOpen: setIsStoreDropdownOpen,
  } = useNotificationStore();

  useEffect(() => {
    loadInitialNotifications();
  }, [loadInitialNotifications]);

  useEffect(() => {
    setIsStoreDropdownOpen(isDropdownOpen);
  }, [isDropdownOpen, setIsStoreDropdownOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((item: NotificationItem) => {
    if (filter === 'unread') return !item.read;
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedItems = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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
        className="relative p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#161619] transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-black shadow-sm animate-in zoom-in-50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#0c0c0e] shadow-2xl shadow-black z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 border-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#08080a]">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/10 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[#08080a]/60">
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={cn(
                'px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                filter === 'all'
                  ? 'bg-[#222226] text-white'
                  : 'text-neutral-400 hover:text-white'
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
                'px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                filter === 'unread'
                  ? 'bg-[#222226] text-white'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-white/[0.03] max-h-[340px] overflow-y-auto">
            {paginatedItems.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs text-neutral-500 font-medium">
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
                    'p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#161619]',
                    !item.read ? 'bg-white/[0.04]' : 'bg-transparent'
                  )}
                >
                  <div className="p-1.5 rounded-xl bg-[#161619] shrink-0 mt-0.5">
                    {typeIcons[item.type] || <Layers className="h-3.5 w-3.5 text-sky-400" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          'text-xs font-bold truncate',
                          !item.read ? 'text-white' : 'text-neutral-300'
                        )}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1.5 shadow-xs" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#08080a] text-xs text-neutral-400">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg hover:bg-[#161619] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg hover:bg-[#161619] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
