import React, { useState } from 'react';
import type { TaskStatus, TaskPriority } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast/ToastContext';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultStatus = 'backlog',
}) => {
  const { users, sprints, addTask } = useBoardStore();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<number>(users[0]?.id || 1);
  const [dueDate, setDueDate] = useState('');
  const [sprintId] = useState<number>(sprints[0]?.id || 1);
  const [error, setError] = useState('');

  // Sync default status when opened
  React.useEffect(() => {
    setStatus(defaultStatus);
  }, [defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId: Number(assigneeId),
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      sprintId: Number(sprintId),
    });

    success('Task created', `"${title}" has been added to ${status}.`);
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const assigneeOptions = users.map((u) => ({
    value: String(u.id),
    label: u.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sprint Task"
      description="Add a task to the active sprint workflow"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Task
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Implement OAuth2 token refresh"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          className="bg-[#13151c] border-white/10"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Column / Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="bg-[#13151c] border-white/10"
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="bg-[#13151c] border-white/10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Assignee"
            options={assigneeOptions}
            value={String(assigneeId)}
            onChange={(e) => setAssigneeId(Number(e.target.value))}
            className="bg-[#13151c] border-white/10"
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-[#13151c] border-white/10"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Add requirements, technical specs or acceptance criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-[#13151c] border border-white/10 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
