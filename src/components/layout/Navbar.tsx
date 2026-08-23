import React, { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  Search,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/Toast/ToastContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export interface NavbarProps {
  onToggleSidebarMobile: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebarMobile, onOpenSearch }) => {
  const { user, logout } = useAuthStore();
  const { info } = useToast();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    info('Logged out', 'You have been signed out of your account.');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#15161f]/90 shadow-md shadow-black/30 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252736] lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Quick Search (⌘K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1d1e2a] hover:bg-[#252736] text-xs text-slate-300 transition-all cursor-pointer shadow-xs"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#2d3042] rounded text-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Real-time Notification Dropdown */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#252736] transition-colors cursor-pointer"
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#252736] shadow-2xl shadow-black/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 bg-[#1d1e2a]/50 rounded-xl mx-1.5 mb-1">
                <p className="text-xs font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1 px-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
