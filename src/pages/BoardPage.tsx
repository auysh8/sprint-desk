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
    <div className="space-y-5">
      {/* Board Top Header — Reference Inspired Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Sprint Board
          </h1>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 shadow-xs">
            Active Sprint
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <BoardFilters onNewTaskClick={handleOpenCreateModal} />

      {/* Main Board Area */}
      {isLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4.5 rounded-3xl bg-[#0c0c0e] space-y-3.5 shadow-md">
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="card" height={110} />
              <Skeleton variant="card" height={110} />
              <Skeleton variant="card" height={110} />
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
