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
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Sprint Board
        </h1>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
          Active
        </span>
      </div>

      {/* Search & Filter Bar */}
      <BoardFilters onNewTaskClick={handleOpenCreateModal} />

      {/* Main Board Area */}
      {isLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#181920]/90 border border-white/[0.06] space-y-3">
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
