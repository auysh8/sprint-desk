import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bookmark, Clock, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Task, User } from '../../types/board';
import { cn } from '../../utils/cn';

export interface TaskCardProps {
  task: Task;
  assignee?: User;
  commentsCount?: number;
  onClick?: () => void;
  isOverlay?: boolean;
}

const priorityConfig: Record<
  Task['priority'],
  { label: string; className: string }
> = {
  high: {
    label: 'HIGH',
    className: 'bg-rose-500/20 text-rose-300',
  },
  medium: {
    label: 'MEDIUM',
    className: 'bg-amber-500/20 text-amber-300',
  },
  low: {
    label: 'LOW',
    className: 'bg-blue-500/20 text-blue-300',
  },
};

const TaskCardComponent: React.FC<TaskCardProps> = ({
  task,
  assignee,
  commentsCount = 0,
  onClick,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDueDate = (dateString: string, status: Task['status']) => {
    if (status === 'done') {
      return { text: 'Completed', isOverdue: false, isDone: true };
    }

    try {
      const due = new Date(dateString);
      const now = new Date();
      const diffMs = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isDone: false };
      }
      if (diffDays === 0) {
        return { text: 'Due today', isOverdue: false, isDone: false };
      }
      return { text: `${diffDays}d left`, isOverdue: false, isDone: false };
    } catch {
      return { text: dateString, isOverdue: false, isDone: false };
    }
  };

  const dueInfo = formatDueDate(task.dueDate, task.status);
  const pConf = priorityConfig[task.priority] || priorityConfig.low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'bg-[#1a1b26] hover:bg-[#222433] rounded-xl p-4 transition-all duration-150 group cursor-grab active:cursor-grabbing select-none space-y-3 relative shadow-md shadow-black/30 hover:shadow-lg hover:shadow-black/50',
        isDragging && 'opacity-30',
        isOverlay && 'shadow-2xl shadow-black/90 rotate-1 scale-[1.02] z-50 bg-[#2b2d3c] cursor-grabbing'
      )}
    >
      {/* Row 1: Flush Task Title (Larger & Clearer) */}
      <h4 className="font-semibold text-sm text-white line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">
        {task.title}
      </h4>

      {/* Row 2: Tag / Priority Chip + Snippet */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            'inline-flex items-center text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-md shrink-0',
            pConf.className
          )}
        >
          {pConf.label}
        </span>
        {task.description && (
          <span className="text-xs text-slate-300 truncate max-w-[200px]">
            {task.description}
          </span>
        )}
      </div>

      {/* Row 3: Clean Minimalist Footer */}
      <div className="flex items-center justify-between pt-1">
        {/* Left: Task ID & Due / Comments */}
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
            <Bookmark className="h-4 w-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
            SD-{task.id}
          </span>

          {dueInfo.isOverdue ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {dueInfo.text}
            </span>
          ) : dueInfo.isDone ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {dueInfo.text}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-normal">
              <Clock className="h-3.5 w-3.5" />
              {dueInfo.text}
            </span>
          )}

          {commentsCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
              {commentsCount}
            </span>
          )}
        </div>

        {/* Right: Assignee Avatar */}
        {assignee ? (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={assignee.name}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15 shrink-0"
          />
        ) : (
          <span className="text-xs text-slate-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export const TaskCard = React.memo(TaskCardComponent);

