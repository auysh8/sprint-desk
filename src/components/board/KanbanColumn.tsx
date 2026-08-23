import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus, User, Comment } from '../../types/board';
import { TaskCard } from './TaskCard';
import { cn } from '../../utils/cn';

export interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  onTaskClick: (task: Task) => void;
  onAddTaskClick: (status: TaskStatus) => void;
}

const columnStatusStyles: Record<
  TaskStatus,
  { dot: string; border: string; badge: string; text: string }
> = {
  backlog: {
    dot: 'bg-slate-400',
    border: 'border-slate-800',
    badge: 'bg-slate-800 text-slate-300',
    text: 'text-slate-300',
  },
  'in-progress': {
    dot: 'bg-amber-400',
    border: 'border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    text: 'text-amber-300',
  },
  review: {
    dot: 'bg-purple-400',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    text: 'text-purple-300',
  },
  done: {
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    text: 'text-emerald-300',
  },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  users,
  comments,
  onTaskClick,
  onAddTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  const taskIds = tasks.map((t) => t.id);
  const statusStyle = columnStatusStyles[id];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-[280px] sm:min-w-[310px] max-w-[360px] rounded-2xl bg-[#0e1017] border border-[#1a1d26] p-3.5 transition-colors',
        isOver && 'border-purple-500/50 bg-[#121520]'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', statusStyle.dot)} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h3>
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusStyle.badge)}>
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTaskClick(id)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-[#191c28] transition-colors cursor-pointer"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] pr-0.5">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => {
            const assignee = users.find((u) => u.id === task.assigneeId);
            const taskComments = comments.filter((c) => c.taskId === task.id);

            return (
              <TaskCard
                key={task.id}
                task={task}
                assignee={assignee}
                commentsCount={taskComments.length}
                onClick={() => onTaskClick(task)}
              />
            );
          })}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-28 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-slate-600">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};
