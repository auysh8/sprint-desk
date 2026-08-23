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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#0c0c0e]/95 shadow-lg shadow-black/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#222226] lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Quick Search (⌘K) — Expanded Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center justify-between w-64 md:w-72 lg:w-80 h-9.5 px-3.5 rounded-xl bg-[#161619] hover:bg-[#222226] text-xs text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer shadow-xs active:scale-[0.99] group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            <span className="font-medium">Quick search...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-[#222226] group-hover:bg-[#2c2c32] rounded-md text-neutral-300 font-mono transition-colors shadow-xs">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-[#222226] group-hover:bg-[#2c2c32] rounded-md text-neutral-300 font-mono transition-colors shadow-xs">
              K
            </kbd>
          </div>
        </button>

        {/* Real-time Notification Dropdown */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#161619] transition-colors cursor-pointer"
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161619] shadow-2xl shadow-black py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 border-0">
              <div className="px-4 py-3 bg-[#222226] rounded-xl mx-1.5 mb-1">
                <p className="text-xs font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1 px-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors cursor-pointer"
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
