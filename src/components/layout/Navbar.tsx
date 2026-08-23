import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  LogOut,
  Search,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useToast } from '../ui/Toast/ToastContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export interface NavbarProps {
  onToggleSidebarMobile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebarMobile }) => {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#1a1c24] bg-[#0b0c10]/85 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161822] lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13151c] border border-white/5 text-xs text-slate-400 hover:border-white/15 hover:text-slate-300 transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#1a1d26] border border-white/5 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161822] transition-colors cursor-pointer"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-purple-400" />
          )}
        </button>

        {/* Real-time Notification Dropdown */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#161822] transition-colors cursor-pointer"
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
              <div className="h-7 w-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#13151c] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
