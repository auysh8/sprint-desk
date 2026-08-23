import React, { useState } from 'react';
import {
  Clock,
  MessageSquare,
  Paperclip,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

interface TaskItem {
  id: string;
  due: string;
  commentsCount: number;
  attachmentsCount: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Todo' | 'Done';
  project: string;
  assignees: string[];
}

const myDayTasks: TaskItem[] = [
  {
    id: '1',
    due: 'In 2h 16m',
    commentsCount: 3,
    attachmentsCount: 0,
    title: 'Review final UI assets for marketing website',
    priority: 'High',
    status: 'In Progress',
    project: 'LumenForge',
    assignees: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '2',
    due: 'In 3h 25m',
    commentsCount: 1,
    attachmentsCount: 2,
    title: 'Oversee copy refinement for integration pages',
    priority: 'Medium',
    status: 'Todo',
    project: 'NebulaCart',
    assignees: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '3',
    due: 'In 4h 12m',
    commentsCount: 0,
    attachmentsCount: 1,
    title: 'Plan and delegate onboarding flow wireframes',
    priority: 'Medium',
    status: 'Todo',
    project: 'EchoSuite',
    assignees: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    ],
  },
];

const teamCapacity = [
  {
    name: 'Olivia Bennett',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    name: 'Daniel Morgan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    name: 'Sophie Kim',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    status: 'online',
  },
];

const recentMentions = [
  {
    name: 'Olivia Bennett',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    text: 'Could you review the typography adjustments for the billing modal?',
    target: '@James',
  },
  {
    name: 'Michael Torres',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Added the Figma design tokens for the interactive data table.',
    target: '@James',
  },
  {
    name: 'Sophie Kim',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'Client approved the initial sprint scope for Sprint 34.',
    target: '@James',
  },
];

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Team' | 'Projects' | 'Insights'>('Overview');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-200">
      {/* Header Area */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['Overview', 'Team', 'Projects', 'Insights'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                activeTab === tab
                  ? 'bg-[#222533] text-white font-semibold shadow-xs border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#14161f]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks completed */}
        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tasks completed</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +3.2%
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">158</span>
            {/* Sparkline equalizer bars */}
            <div className="flex items-end gap-1 h-8">
              {[40, 65, 30, 85, 100, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-t-sm bg-purple-500"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Completion rate */}
        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completion rate</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +6.5%
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">89%</span>
            {/* Purple wave curve sparkline */}
            <svg className="w-16 h-8 overflow-visible" viewBox="0 0 64 32">
              <path
                d="M 0 24 Q 16 28 32 16 T 64 4"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending reviews */}
        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pending reviews</span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">7</span>
            {/* Overlapping team avatar bubbles with numbered count */}
            <div className="flex items-center -space-x-2">
              {teamCapacity.map((member, i) => (
                <div key={member.name} className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-[#12141a]"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-[#1d202c] text-slate-200 h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white/10">
                    {4 - i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Overdue tasks */}
        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Overdue / Blocked</span>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Needs action
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">2</span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left My Day (Tasks) + Right (Capacity & Mentions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column (Span 2): My Day */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">My day</h2>
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#151720] border border-white/5 transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          {/* Task Card List */}
          <div className="space-y-3">
            {myDayTasks.map((task) => (
              <div
                key={task.id}
                className="card-surface p-4 rounded-2xl transition-all duration-150 hover:bg-[#151822] space-y-3 cursor-pointer group"
              >
                {/* Top Row: Due Date & Metadata Icons */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{task.due}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{task.commentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>{task.attachmentsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Task Title */}
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {task.title}
                </h3>

                {/* Bottom Row: Priority, Status, Project, Assignees */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority Pill */}
                    <Badge
                      variant={task.priority === 'High' ? 'danger' : 'primary'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>

                    {/* Status Pill */}
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {task.status}
                    </span>

                    {/* Project Tag Pill */}
                    <Badge variant="tag" size="sm">
                      {task.project}
                    </Badge>
                  </div>

                  {/* Assignees Overlapping Avatars */}
                  <div className="flex items-center -space-x-1.5">
                    {task.assignees.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="assignee"
                        className="h-6 w-6 rounded-full object-cover ring-2 ring-[#12141a]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Span 1): Team Capacity & Recent Mentions */}
        <div className="space-y-6">
          {/* Team Capacity Box */}
          <div className="card-surface p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-semibold text-white">Team capacity</h2>

            <div className="space-y-3">
              {teamCapacity.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#12141a]" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mentions Box */}
          <div className="card-surface p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-semibold text-white">Recent mentions</h2>

            <div className="space-y-3.5">
              {recentMentions.map((mention, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <img
                    src={mention.avatar}
                    alt={mention.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                  />
                  <div className="text-xs space-y-0.5 min-w-0">
                    <span className="font-semibold text-slate-200 block">{mention.name}</span>
                    <p className="text-slate-400 leading-relaxed break-words">
                      <span className="text-purple-400 font-medium mr-1">{mention.target}</span>
                      {mention.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
