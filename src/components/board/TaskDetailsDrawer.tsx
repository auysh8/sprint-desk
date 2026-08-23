import React, { useState, useEffect } from 'react';
import { Trash2, Send } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast/ToastContext';

export interface TaskDetailsDrawerProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest: (task: Task) => void;
}

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  taskId,
  isOpen,
  onClose,
  onDeleteRequest,
}) => {
  const { tasks, users, comments, updateTask, addComment } = useBoardStore();
  const { success } = useToast();

  const task = tasks.find((t) => t.id === taskId);
  const taskComments = comments.filter((c) => c.taskId === taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<number>(1);
  const [dueDate, setDueDate] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId);
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    updateTask(task.id, {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
    });
    success('Task saved', 'Changes have been updated successfully.');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(task.id, 1, newComment.trim()); // Current active user
    setNewComment('');
    success('Comment added', 'Your note has been posted.');
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Badge variant="tag" size="sm">
            SD-{task.id}
          </Badge>
          <span className="truncate">Task Details</span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteRequest(task)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete Task
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-slate-200">
        {/* Title Input */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-semibold bg-[#13151c] border-white/10"
          />
        </div>

        {/* Status, Priority & Assignee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Status"
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

          <Select
            label="Assignee"
            options={assigneeOptions}
            value={String(assigneeId)}
            onChange={(e) => setAssigneeId(Number(e.target.value))}
            className="bg-[#13151c] border-white/10"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            Due Date
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-[#13151c] border-white/10"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed task requirements or notes..."
            className="w-full rounded-xl bg-[#13151c] border border-white/10 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          />
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h4 className="text-sm font-semibold text-white">
            Activity & Comments ({taskComments.length})
          </h4>

          {/* Comment composer */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Leave a comment or update..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-xl bg-[#13151c] border border-white/10 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newComment.trim()}
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              Post
            </Button>
          </form>

          {/* Comment stream */}
          <div className="space-y-3 pt-2">
            {taskComments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No comments yet.</p>
            ) : (
              taskComments.map((comment) => {
                const author = users.find((u) => u.id === comment.authorId);
                return (
                  <div
                    key={comment.id}
                    className="p-3 rounded-xl bg-[#12141c] border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {author?.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                            {author?.name[0] || 'U'}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-200">
                          {author?.name || 'Team Member'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-7">
                      {comment.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
