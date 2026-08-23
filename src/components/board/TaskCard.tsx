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

interface CardTheme {
  cardBg: string;
  titleColor: string;
  descColor: string;
  badgeBg: string;
  badgeText: string;
  subtleBadgeBg: string;
  footerTextColor: string;
  avatarRing: string;
}

// Solid saturated themes matching the reference design
const statusCardThemes: Record<Task['status'], CardTheme> = {
  done: {
    cardBg: 'bg-[#50c878] hover:bg-[#48bd70]',
    titleColor: 'text-[#04200f]',
    descColor: 'text-[#093319]',
    badgeBg: 'bg-[#04200f] text-white',
    badgeText: 'text-white',
    subtleBadgeBg: 'bg-black/15 text-[#04200f]',
    footerTextColor: 'text-[#062914]',
    avatarRing: 'ring-[#04200f]/30',
  },
  backlog: {
    cardBg: 'bg-[#f37a6b] hover:bg-[#e86f60]',
    titleColor: 'text-[#260509]',
    descColor: 'text-[#420c13]',
    badgeBg: 'bg-[#260509] text-white',
    badgeText: 'text-white',
    subtleBadgeBg: 'bg-black/15 text-[#260509]',
    footerTextColor: 'text-[#2e070c]',
    avatarRing: 'ring-[#260509]/30',
  },
  'in-progress': {
    cardBg: 'bg-[#f4d35e] hover:bg-[#e8c650]',
    titleColor: 'text-[#261801]',
    descColor: 'text-[#3d2703]',
    badgeBg: 'bg-[#261801] text-white',
    badgeText: 'text-white',
    subtleBadgeBg: 'bg-black/15 text-[#261801]',
    footerTextColor: 'text-[#2b1c02]',
    avatarRing: 'ring-[#261801]/30',
  },
  review: {
    cardBg: 'bg-[#8a5df5] hover:bg-[#7d4fe8]',
    titleColor: 'text-white',
    descColor: 'text-[#ece4fd]',
    badgeBg: 'bg-white/25 text-white',
    badgeText: 'text-white',
    subtleBadgeBg: 'bg-black/20 text-white',
    footerTextColor: 'text-white/90',
    avatarRing: 'ring-white/40',
  },
};

const priorityLabels: Record<Task['priority'], string> = {
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
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

  const theme = statusCardThemes[task.status] || statusCardThemes.backlog;

  const formatDueDate = (dateString: string, status: Task['status']) => {
    if (status === 'done') {
      return { text: 'Done', isOverdue: false, isDone: true };
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
        return { text: 'Today', isOverdue: false, isDone: false };
      }
      return { text: `${diffDays}d left`, isOverdue: false, isDone: false };
    } catch {
      return { text: dateString, isOverdue: false, isDone: false };
    }
  };

  const dueInfo = formatDueDate(task.dueDate, task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4 transition-all duration-150 group cursor-grab active:cursor-grabbing select-none space-y-2.5 relative shadow-md shadow-black/25 hover:shadow-xl hover:scale-[1.01]',
        theme.cardBg,
        isDragging && 'opacity-30 scale-95',
        isOverlay && 'shadow-2xl shadow-black/90 rotate-1 scale-[1.04] z-50 cursor-grabbing'
      )}
    >
      {/* Row 1: Title + Priority Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <h4 className={cn('font-bold text-sm leading-snug line-clamp-2', theme.titleColor)}>
          {task.title}
        </h4>
        <span
          className={cn(
            'inline-flex items-center text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md shrink-0 shadow-xs',
            theme.badgeBg
          )}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      {/* Row 2: Description snippet */}
      {task.description && (
        <p className={cn('text-xs font-medium line-clamp-1 opacity-90 leading-relaxed', theme.descColor)}>
          {task.description}
        </p>
      )}

      {/* Row 3: Footer with ID, Due Date/Comments, and Assignee Avatar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {/* SD ID Badge */}
          <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs shrink-0', theme.subtleBadgeBg)}>
            <Bookmark className="h-3 w-3 fill-current opacity-80" />
            <span>SD-{task.id}</span>
          </span>

          {/* Due status with High-Contrast Overdue Alert Pill */}
          {dueInfo.isOverdue ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs shrink-0 animate-pulse">
              <AlertTriangle className="h-3 w-3 stroke-[2.5] text-white" />
              <span>{dueInfo.text}</span>
            </span>
          ) : dueInfo.isDone ? (
            <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs shrink-0', theme.subtleBadgeBg)}>
              <CheckCircle2 className="h-3 w-3" />
              <span>{dueInfo.text}</span>
            </span>
          ) : (
            <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs shrink-0', theme.subtleBadgeBg)}>
              <Clock className="h-3 w-3 opacity-80" />
              <span>{dueInfo.text}</span>
            </span>
          )}

          {/* Comments count */}
          {commentsCount > 0 && (
            <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs shrink-0', theme.subtleBadgeBg)}>
              <MessageSquare className="h-3 w-3 opacity-80" />
              <span>{commentsCount}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignee ? (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={assignee.name}
            className={cn('h-6 w-6 rounded-full object-cover ring-2 shrink-0 shadow-xs', theme.avatarRing)}
          />
        ) : (
          <span className={cn('text-[10px] font-bold italic opacity-75 shrink-0', theme.footerTextColor)}>
            Unassigned
          </span>
        )}
      </div>
    </div>
  );
};

export const TaskCard = React.memo(TaskCardComponent);
