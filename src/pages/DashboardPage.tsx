import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { DataTable, type ColumnDef } from '../components/ui/DataTable';
import type { Task } from '../types/board';
import { cn } from '../utils/cn';

// M3 Expressive Soft Pill Chips
const statusConfig: Record<string, { label: string; className: string }> = {
  backlog: { label: 'Backlog', className: 'bg-slate-500/20 text-slate-300' },
  'in-progress': { label: 'In Progress', className: 'bg-violet-500/20 text-violet-300' },
  review: { label: 'Review', className: 'bg-amber-500/20 text-amber-300' },
  done: { label: 'Done', className: 'bg-emerald-500/20 text-emerald-300' },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: 'HIGH', className: 'bg-rose-500/20 text-rose-300' },
  medium: { label: 'MEDIUM', className: 'bg-amber-500/20 text-amber-300' },
  low: { label: 'LOW', className: 'bg-blue-500/20 text-blue-300' },
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, users, loadBoardData, setSelectedTaskId } = useBoardStore();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'Overview' | 'My Tasks' | 'All Tasks'>('Overview');

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  // Derived metrics from live boardStore
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress' || t.status === 'review').length;
    const now = new Date();
    const overdue = tasks.filter(
      (t) => t.status !== 'done' && new Date(t.dueDate) < now
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate,
    };
  }, [tasks]);

  // Filter tasks assigned to current user
  const myTasks = useMemo(() => {
    const matchedUser = users.find(
      (u) =>
        u.email === currentUser?.email ||
        u.name.toLowerCase().includes(currentUser?.firstName?.toLowerCase() || '')
    );
    const userId = matchedUser ? matchedUser.id : 1; // Default to lead user id 1
    return tasks.filter((t) => t.assigneeId === userId);
  }, [tasks, users, currentUser]);

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    navigate('/board');
  };

  // DataTable columns definition for Tasks
  const taskColumns: ColumnDef<Task>[] = [
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      cell: (task) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white group-hover:text-violet-300 transition-colors">
            {task.title}
          </span>
          <span className="text-xs text-slate-400 line-clamp-1">
            {task.description}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (task) => {
        const conf = statusConfig[task.status] || statusConfig.backlog;
        return (
          <span className={cn('inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border', conf.className)}>
            {conf.label}
          </span>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      cell: (task) => {
        const conf = priorityConfig[task.priority] || priorityConfig.low;
        return (
          <span className={cn('inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full border', conf.className)}>
            {conf.label}
          </span>
        );
      },
    },
    {
      key: 'assigneeId',
      header: 'Assignee',
      cell: (task) => {
        const assignee = users.find((u) => u.id === task.assigneeId);
        return (
          <div className="flex items-center gap-2">
            <img
              src={assignee?.avatar || 'https://i.pravatar.cc/150?img=1'}
              alt={assignee?.name || 'User'}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="text-xs text-slate-300 truncate">{assignee?.name?.split(' ')[0] || 'Unassigned'}</span>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      cell: (task) => {
        const isPast = new Date(task.dueDate) < new Date() && task.status !== 'done';
        return (
          <span className={cn('text-xs font-medium', isPast ? 'text-rose-400' : 'text-slate-400')}>
            {task.dueDate}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-200">
      {/* Header Area */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back, {currentUser?.firstName || 'Lead'}
        </h1>
      </div>

      {/* Top 4 KPI Metrics Cards — Colorful Dark Tonal Cards (Borderless Elevated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Tasks (Emerald) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-[#12221b] p-5 rounded-2xl flex flex-col justify-between space-y-2 shadow-md shadow-black/30 transition-colors"
        >
          <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Completed Tasks</span>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold text-emerald-100 tracking-tight">
              {metrics.completed} <span className="text-sm font-normal text-emerald-300/70">/ {metrics.total}</span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold">{metrics.completionRate}% completion rate</p>
          </div>
        </motion.div>

        {/* Card 2: Active In-Flight (Violet) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-[#201830] p-5 rounded-2xl flex flex-col justify-between space-y-2 shadow-md shadow-black/30 transition-colors"
        >
          <span className="text-xs uppercase font-bold text-violet-300 tracking-wider">Active In-Flight</span>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold text-violet-200 tracking-tight">
              {metrics.inProgress}
            </div>
            <p className="text-xs text-violet-300/80 font-medium">In Progress & Review</p>
          </div>
        </motion.div>

        {/* Card 3: Assigned to Me (Sky) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-[#122030] p-5 rounded-2xl flex flex-col justify-between space-y-2 shadow-md shadow-black/30 transition-colors"
        >
          <span className="text-xs uppercase font-bold text-sky-300 tracking-wider">Assigned to Me</span>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold text-sky-100 tracking-tight">
              {myTasks.length}
            </div>
            <p className="text-xs text-sky-300 font-semibold">
              {myTasks.filter((t) => t.status !== 'done').length} pending tasks
            </p>
          </div>
        </motion.div>

        {/* Card 4: Overdue Tasks (Rose) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-[#28151c] p-5 rounded-2xl flex flex-col justify-between space-y-2 shadow-md shadow-black/30 transition-colors"
        >
          <span className="text-xs uppercase font-bold text-rose-300 tracking-wider">Overdue Tasks</span>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold text-rose-200 tracking-tight">
              {metrics.overdue}
            </div>
            <p className="text-xs text-rose-300/80 font-medium">Past target due date</p>
          </div>
        </motion.div>
      </div>

      {/* Section Header with Inline Segmented View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Workload & Tasks
            </h2>
          </div>

          {/* Inline Segmented Control */}
          <div className="inline-flex items-center gap-1 bg-[#15161f] p-1 rounded-full shadow-xs">
            {(['Overview', 'My Tasks', 'All Tasks'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'relative px-3.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dashboard-active-pill"
                      className="absolute inset-0 bg-[#252736] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'Overview' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/board')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="text-xs text-violet-400 hover:text-violet-300 hover:bg-[#15161f]"
          >
            Go to Kanban Board
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Span 2): Active Workload Cards — F-Pattern Layout */}
          <div className="lg:col-span-2 space-y-3">
            {myTasks.slice(0, 5).map((task) => {
              const pConf = priorityConfig[task.priority] || priorityConfig.low;
              const sConf = statusConfig[task.status] || statusConfig.backlog;

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => handleTaskClick(task)}
                  className="bg-[#1d1e2a] hover:bg-[#252736] p-4 rounded-2xl transition-all duration-150 space-y-2.5 cursor-pointer group shadow-xs hover:shadow-md"
                >
                  {/* Top Row: Task Title (Left) + Grouped Priority & Status Chips (Right) */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors leading-snug truncate">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn('inline-flex items-center text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-md', pConf.className)}>
                        {pConf.label}
                      </span>
                      <span className={cn('inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md', sConf.className)}>
                        {sConf.label}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Task Description */}
                  <p className="text-sm text-slate-300 line-clamp-1">{task.description}</p>

                  {/* Bottom Footer: Subtly decreased visual prominence Due Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-normal pt-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>Due {task.dueDate}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sprint Team Capacity — Streamlined Clean Widget */}
          <div className="space-y-6">
            <div className="bg-[#15161f] p-4.5 rounded-2xl space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Sprint Team Capacity</h3>
                <span className="text-xs text-slate-400">{users.length} members</span>
              </div>

              <div className="space-y-2.5">
                {users.map((member) => {
                  const memberAssigned = tasks.filter((t) => t.assigneeId === member.id);
                  const memberDone = memberAssigned.filter((t) => t.status === 'done').length;
                  const percent = memberAssigned.length > 0 ? Math.round((memberDone / memberAssigned.length) * 100) : 0;

                  return (
                    <div
                      key={member.id}
                      className="space-y-2.5 p-3 rounded-xl bg-[#1d1e2a] shadow-xs"
                    >
                      {/* Name (Left) and Percentage (Right) on the same baseline */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <span className="text-xs font-semibold text-slate-200 leading-none">
                            {member.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-violet-300 leading-none">{percent}%</span>
                      </div>

                      {/* Smooth Thick (h-2) Rounded Progress Bar with High-Contrast Background Track */}
                      <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: My Tasks or All Tasks DataTable */}
      {(activeTab === 'My Tasks' || activeTab === 'All Tasks') && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 pt-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Interactive data table with sorting, global search, and instant filtering.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/board')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Open in Board
            </Button>
          </div>

          <DataTable
            data={activeTab === 'My Tasks' ? myTasks : tasks}
            columns={taskColumns}
            searchPlaceholder="Search task title, description, or status..."
            pageSize={8}
            onRowClick={handleTaskClick}
          />
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;

