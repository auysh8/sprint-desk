import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task, TaskStatus, Column } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useToast } from '../ui/Toast/ToastContext';

const columns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  onAddTaskClick: (status: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onTaskClick,
  onAddTaskClick,
}) => {
  const {
    tasks,
    users,
    comments,
    filters,
    moveTask,
    reorderTask,
    undoLastAction,
  } = useBoardStore();

  const { success } = useToast();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Setup sensors with distance constraint to distinguish click vs drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on active board filters
  const filteredTasks = tasks.filter((task) => {
    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Assignee filter
    if (filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) {
      return false;
    }

    // Sprint filter
    if (filters.sprintId !== 'all' && task.sprintId !== filters.sprintId) {
      return false;
    }

    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = () => {
    // Optional real-time container crossing if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = Number(active.id);
    const activeTask = tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;

    const overId = over.id;

    // Check if dropped directly onto a Column
    const isOverColumn = columns.some((col) => col.id === overId);

    if (isOverColumn) {
      const destStatus = overId as TaskStatus;
      if (activeTask.status !== destStatus) {
        moveTask(activeTaskId, destStatus);
        showMoveToast(activeTask.title, destStatus);
      }
      return;
    }

    // Dropped onto another task
    const overTaskId = Number(overId);
    const overTask = tasks.find((t) => t.id === overTaskId);

    if (overTask) {
      if (activeTask.status === overTask.status) {
        // Reordering in same column
        const columnTasks = tasks
          .filter((t) => t.status === activeTask.status)
          .sort((a, b) => a.order - b.order);
        const overIndex = columnTasks.findIndex((t) => t.id === overTaskId);
        if (overIndex !== -1) {
          reorderTask(activeTaskId, overIndex);
        }
      } else {
        // Moving to another column at specific position
        const destColumnTasks = tasks
          .filter((t) => t.status === overTask.status)
          .sort((a, b) => a.order - b.order);
        const overIndex = destColumnTasks.findIndex((t) => t.id === overTaskId);
        moveTask(activeTaskId, overTask.status, overIndex);
        showMoveToast(activeTask.title, overTask.status);
      }
    }
  };

  const showMoveToast = (taskTitle: string, status: TaskStatus) => {
    const statusLabels: Record<TaskStatus, string> = {
      backlog: 'Backlog',
      'in-progress': 'In Progress',
      review: 'Review',
      done: 'Done',
    };

    success(
      'Task updated',
      `Moved "${taskTitle}" to ${statusLabels[status]}`,
      {
        action: {
          label: 'Undo move',
          onClick: () => {
            undoLastAction();
          },
        },
      }
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 items-start min-h-[calc(100vh-220px)]">
        {columns.map((column) => {
          const columnTasks = filteredTasks
            .filter((t) => t.status === column.id)
            .sort((a, b) => a.order - b.order);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              users={users}
              comments={comments}
              onTaskClick={onTaskClick}
              onAddTaskClick={onAddTaskClick}
            />
          );
        })}
      </div>

      {/* Drag Overlay with floating preview */}
      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            assignee={users.find((u) => u.id === activeTask.assigneeId)}
            commentsCount={comments.filter((c) => c.taskId === activeTask.id).length}
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
