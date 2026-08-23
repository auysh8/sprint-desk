import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Task } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast/ToastContext';

export interface DeleteTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { deleteTask } = useBoardStore();
  const { success } = useToast();

  if (!task) return null;

  const handleDelete = () => {
    deleteTask(task.id);
    success('Task deleted', `"${task.title}" has been permanently removed.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete Permanently
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 text-slate-300">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-white">
            Are you sure you want to delete this task?
          </p>
          <p className="text-slate-400 leading-relaxed">
            This will permanently remove <span className="text-slate-200 font-medium">"{task.title}"</span> and all associated comments. This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};
