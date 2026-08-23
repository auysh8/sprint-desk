import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Zap,
  Target,
  LayoutGrid,
  CheckSquare,
  Calendar,
  Inbox,
  BarChart2,
  MoreHorizontal,
  Search,
  Plus,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const mainNav = [
  { label: 'Focus', to: '/focus', icon: <Target className="h-4 w-4" /> },
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutGrid className="h-4 w-4" /> },
  { label: 'Tasks', to: '/board', icon: <CheckSquare className="h-4 w-4" /> },
  { label: 'Schedule', to: '/schedule', icon: <Calendar className="h-4 w-4" /> },
];

const secondaryNav = [
  { label: 'Inbox', to: '/inbox', icon: <Inbox className="h-4 w-4" />, badge: '6', badgeColor: 'bg-rose-500 text-white' },
  { label: 'Analytics', to: '/analytics', icon: <BarChart2 className="h-4 w-4" /> },
  { label: 'More', to: '/more', icon: <MoreHorizontal className="h-4 w-4" /> },
];

const teamMembers = [
  {
    name: 'Olivia Bennett',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    statusColor: 'bg-rose-500',
    equalizer: [40, 70, 90],
    barColor: 'bg-rose-500',
  },
  {
    name: 'Daniel Morgan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    statusColor: 'bg-amber-500',
    equalizer: [80, 50, 60],
    barColor: 'bg-amber-500',
  },
  {
    name: 'Ethan Reynolds',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    statusColor: 'bg-emerald-500',
    equalizer: [60, 90, 75],
    barColor: 'bg-emerald-500',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#0d0e12] border-r border-[#1a1c24] text-slate-400 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 select-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Header: Logo + Collapse Button */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-white text-black flex items-center justify-center shadow-md">
              <Zap className="h-4 w-4 fill-black text-black" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              SprintDesk
            </span>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#161822] transition-colors"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 lg:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-1">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#13151c] border border-white/5 text-xs text-slate-400 hover:border-white/15 hover:text-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <kbd className="px-1 py-0.5 bg-[#1a1d26] border border-white/5 rounded">⌘</kbd>
              <kbd className="px-1 py-0.5 bg-[#1a1d26] border border-white/5 rounded">F</kbd>
            </div>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* Main Items */}
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'glow-active text-white font-semibold border border-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#14161f]'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Secondary Items */}
          <div className="space-y-1 pt-1 border-t border-white/5">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'glow-active text-white font-semibold border border-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#14161f]'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center shadow-xs',
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* My Team Section */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-slate-400">My team</span>
              <button
                type="button"
                className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#161822] transition-colors"
                aria-label="Add team member"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#14161f] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors truncate">
                      {member.name}
                    </span>
                  </div>

                  {/* Equalizer activity indicator */}
                  <div className="flex items-end gap-0.5 h-3">
                    <div
                      className={cn('w-0.5 rounded-full', member.barColor)}
                      style={{ height: `${member.equalizer[0]}%` }}
                    />
                    <div
                      className={cn('w-0.5 rounded-full', member.barColor)}
                      style={{ height: `${member.equalizer[1]}%` }}
                    />
                    <div
                      className={cn('w-0.5 rounded-full', member.barColor)}
                      style={{ height: `${member.equalizer[2]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
