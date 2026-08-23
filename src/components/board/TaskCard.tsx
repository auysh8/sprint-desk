import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MessageSquare, GripVertical, AlertTriangle } from 'lucide-react';
import type { Task, User } from '../../types/board';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface TaskCardProps {
  task: Task;
  assignee?: User;
  commentsCount?: number;
  onClick?: () => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
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

  const getPriorityVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDueDate = (dateString: string) => {
    try {
      const due = new Date(dateString);
      const now = new Date();
      const diffMs = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
      }
      if (diffDays === 0) {
        return { text: 'Due today', isOverdue: false };
      }
      return { text: `${diffDays}d left`, isOverdue: false };
    } catch {
      return { text: dateString, isOverdue: false };
    }
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        'card-surface rounded-2xl p-4 transition-all duration-150 group cursor-pointer select-none space-y-3 relative',
        isDragging && 'opacity-30 border-purple-500/50',
        isOverlay && 'shadow-2xl shadow-purple-950/80 border-purple-500/80 rotate-2 scale-105 z-50 bg-[#151822]'
      )}
    >
      {/* Top Row: Drag Handle, Due Date & Comment Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-slate-600 hover:text-slate-300 transition-colors p-0.5 rounded cursor-grab active:cursor-grabbing"
            aria-label="Drag task"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>

          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-medium',
              dueInfo.isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
            )}
          >
            {dueInfo.isOverdue ? (
              <AlertTriangle className="h-3 w-3 text-rose-400" />
            ) : (
              <Clock className="h-3 w-3 text-slate-500" />
            )}
            {dueInfo.text}
          </span>
        </div>

        {commentsCount > 0 && (
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
            <span>{commentsCount}</span>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom Row: Priority Badge & Assignee Avatar */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <Badge variant={getPriorityVariant(task.priority)} size="sm">
          {task.priority.toUpperCase()}
        </Badge>

        {assignee ? (
          <div className="flex items-center gap-1.5" title={assignee.name}>
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="text-[11px] text-slate-400 hidden sm:inline max-w-[80px] truncate">
              {assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};
