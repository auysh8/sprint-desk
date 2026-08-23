import React, { useEffect, useState } from 'react';
import type { Task, TaskStatus } from '../types/board';
import { useBoardStore } from '../store/boardStore';
import { KanbanBoard } from '../components/board/KanbanBoard';
import { BoardFilters } from '../components/board/BoardFilters';
import { TaskDetailsDrawer } from '../components/board/TaskDetailsDrawer';
import { CreateTaskModal } from '../components/board/CreateTaskModal';
import { DeleteTaskModal } from '../components/board/DeleteTaskModal';
import { Skeleton } from '../components/ui/Skeleton';

export const BoardPage: React.FC = () => {
  const { loadBoardData, isLoading, tasks, selectedTaskId, setSelectedTaskId } = useBoardStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<TaskStatus>('backlog');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  const handleOpenCreateModal = (status?: TaskStatus) => {
    setCreateDefaultStatus(status || 'backlog');
    setCreateModalOpen(true);
  };

  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task);
  };

  return (
    <div className="space-y-4">
      {/* Board Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sprint 34 Kanban
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop tasks between columns. Changes persist automatically.
          </p>
        </div>

        {/* Sprint Summary Pill */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-medium text-white">{tasks.length} total tasks</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">
            {tasks.filter((t) => t.status === 'done').length} completed
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <BoardFilters onNewTaskClick={handleOpenCreateModal} />

      {/* Main Board Area */}
      {isLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#0e1017] border border-[#1a1d26] space-y-3">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="card" height={100} />
              <Skeleton variant="card" height={100} />
              <Skeleton variant="card" height={100} />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard
          onTaskClick={handleTaskClick}
          onAddTaskClick={handleOpenCreateModal}
        />
      )}

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        taskId={selectedTaskId}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultStatus={createDefaultStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        task={taskToDelete}
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
      />
    </div>
  );
};

export default BoardPage;
