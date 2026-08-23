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

const columnHeaderPillConfig: Record<TaskStatus, { badge: string; dot: string }> = {
  backlog: {
    badge: 'bg-[#f37a6b]/20 text-[#fca5a5]',
    dot: 'bg-[#f37a6b]',
  },
  'in-progress': {
    badge: 'bg-[#f4d35e]/20 text-[#fde047]',
    dot: 'bg-[#f4d35e]',
  },
  review: {
    badge: 'bg-[#8a5df5]/20 text-[#c4b5fd]',
    dot: 'bg-[#8a5df5]',
  },
  done: {
    badge: 'bg-[#50c878]/20 text-[#86efac]',
    dot: 'bg-[#50c878]',
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
  const pillConf = columnHeaderPillConfig[id] || columnHeaderPillConfig.backlog;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-[285px] w-full rounded-3xl p-4.5 transition-all duration-200 shadow-xl shadow-black/80 bg-[#0c0c0e]',
        isOver && 'brightness-125 shadow-2xl shadow-black scale-[1.01]'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 mb-2">
        <div className="flex items-center gap-2.5">
          <span className={cn('h-2.5 w-2.5 rounded-full', pillConf.dot)} />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
            {title}
          </h3>
          <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full', pillConf.badge)}>
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTaskClick(id)}
          className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222226] transition-colors cursor-pointer"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task Cards Container (Scrollbar hidden for clean visual aesthetic) */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 max-h-[calc(100vh-270px)] min-h-[320px]">
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
          <div className="h-32 rounded-2xl flex flex-col items-center justify-center text-xs font-medium text-neutral-500 bg-[#161619]/60 border-2 border-dashed border-white/5">
            <span>Drop tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
};
