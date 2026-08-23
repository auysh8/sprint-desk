import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  CheckSquare,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';

import { BrandLogo } from '../ui/BrandLogo';

export interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutGrid className="h-4 w-4 shrink-0" /> },
  { label: 'Sprint Board', to: '/board', icon: <CheckSquare className="h-4 w-4 shrink-0" /> },
  { label: 'Analytics', to: '/analytics', icon: <BarChart2 className="h-4 w-4 shrink-0" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0c0c0e] shadow-2xl shadow-black text-neutral-400 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 select-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-16' : 'lg:w-56',
          'w-56'
        )}
      >
        {/* Top Header: Logo + Collapse Button */}
        <div className={cn('flex h-16 items-center px-4', isCollapsed ? 'justify-center' : 'justify-between')}>
          <BrandLogo size="md" showText={!isCollapsed} />

          {/* Desktop Collapse Button */}
          {onToggleCollapse && !isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#222226] transition-colors hidden lg:block cursor-pointer"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#222226] lg:hidden cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Collapsed Expand Toggle */}
        {isCollapsed && onToggleCollapse && (
          <div className="hidden lg:flex justify-center py-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222226] transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150',
                  isCollapsed && 'justify-center px-2 py-3',
                  isActive
                    ? 'text-black font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#222226]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Animated High-Contrast Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-white rounded-2xl shadow-lg shadow-white/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className={cn('relative z-10', isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white')}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="relative z-10 truncate font-semibold">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};
