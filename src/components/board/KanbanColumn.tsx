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
  {
    bg: string;
    badge: string;
    text: string;
  }
> = {
  backlog: {
    bg: 'bg-[#22151f]',
    badge: 'bg-pink-500/20 text-pink-300',
    text: 'text-pink-200',
  },
  'in-progress': {
    bg: 'bg-[#251b12]',
    badge: 'bg-amber-500/20 text-amber-300',
    text: 'text-amber-200',
  },
  review: {
    bg: 'bg-[#111f2c]',
    badge: 'bg-sky-500/20 text-sky-300',
    text: 'text-sky-200',
  },
  done: {
    bg: 'bg-[#1c142b]',
    badge: 'bg-purple-500/20 text-purple-300',
    text: 'text-purple-200',
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
        'flex flex-col flex-1 min-w-[260px] w-full rounded-2xl p-4 transition-all duration-200 shadow-md shadow-black/40 backdrop-blur-xs',
        statusStyle.bg,
        isOver && 'brightness-125 shadow-xl shadow-black/70 scale-[1.01]'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2 px-1 mb-2">
        <div className="flex items-center gap-2">
          <h3 className={cn('text-xs font-bold uppercase tracking-wider', statusStyle.text)}>
            {title}
          </h3>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', statusStyle.badge)}>
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTaskClick(id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task Cards Container (Scrollbar hidden for clean visual aesthetic) */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 max-h-[calc(100vh-270px)] min-h-[300px]">
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
          <div className="h-28 border-2 border-dashed border-violet-500/20 rounded-xl flex items-center justify-center text-xs text-slate-500 bg-violet-500/5">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

