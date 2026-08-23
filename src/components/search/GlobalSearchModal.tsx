import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { Badge } from '../ui/Badge';
import type { Task } from '../../types/board';
import { cn } from '../../utils/cn';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { tasks, users, setSelectedTaskId } = useBoardStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredTasks = tasks.filter((task) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const assignee = users.find((u) => u.id === task.assigneeId)?.name.toLowerCase() || '';
    return (
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.status.toLowerCase().includes(q) ||
      task.priority.toLowerCase().includes(q) ||
      assignee.includes(q)
    );
  });

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
    onClose();
    navigate('/board');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTasks.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTasks.length - 1));
      } else if (e.key === 'Enter' && filteredTasks[selectedIndex]) {
        e.preventDefault();
        handleSelectTask(filteredTasks[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTasks, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-[#252736] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 bg-[#1d1e2a]/60 gap-3">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search tasks, descriptions, priorities, assignees..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#2d3042] text-slate-300 rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No tasks found matching "{query}"
                </div>
              ) : (
                filteredTasks.map((task, idx) => {
                  const isSelected = idx === selectedIndex;
                  const assignee = users.find((u) => u.id === task.assigneeId);

                  return (
                    <motion.div
                      key={task.id}
                      onClick={() => handleSelectTask(task)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors',
                        isSelected
                          ? 'bg-violet-500/20 text-violet-200 shadow-xs'
                          : 'hover:bg-white/5 text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {task.status === 'done' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : task.priority === 'high' ? (
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                        )}

                        <div className="truncate min-w-0">
                          <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'danger'
                              : task.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>

                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:inline-block">
                          {task.status}
                        </span>

                        {assignee && (
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10 hidden sm:inline-block"
                          />
                        )}

                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-[#0e1017] border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Navigate</span>
                <kbd className="px-1 py-0.5 bg-white dark:bg-[#1a1d26] rounded border border-slate-200 dark:border-white/10">↑</kbd>
                <kbd className="px-1 py-0.5 bg-white dark:bg-[#1a1d26] rounded border border-slate-200 dark:border-white/10">↓</kbd>
                <span className="ml-2">Select</span>
                <kbd className="px-1 py-0.5 bg-white dark:bg-[#1a1d26] rounded border border-slate-200 dark:border-white/10">↵</kbd>
              </div>
              <span>{filteredTasks.length} results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
