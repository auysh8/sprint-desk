import React from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { TaskPriority, TaskStatus } from '../../types/board';

export interface BoardFiltersProps {
  onNewTaskClick: (status?: TaskStatus) => void;
}

export const BoardFilters: React.FC<BoardFiltersProps> = ({ onNewTaskClick }) => {
  const { filters, setFilters, resetFilters, users } = useBoardStore();

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all';

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const assigneeOptions = [
    { value: 'all', label: 'All Assignees' },
    ...users.map((u) => ({ value: String(u.id), label: u.name })),
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Filter tasks by keyword..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
            clearable
            onClear={() => setFilters({ searchQuery: '' })}
            className="h-9 bg-[#1d1e2a] text-white placeholder:text-slate-500 shadow-xs"
          />
        </div>

        {/* Priority Filter */}
        <div className="w-36">
          <Select
            options={priorityOptions}
            value={filters.priority}
            onChange={(e) =>
              setFilters({ priority: e.target.value as TaskPriority | 'all' })
            }
            className="h-9 bg-[#1d1e2a] text-xs text-white shadow-xs"
          />
        </div>

        {/* Assignee Filter */}
        <div className="w-40">
          <Select
            options={assigneeOptions}
            value={String(filters.assigneeId)}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({ assigneeId: val === 'all' ? 'all' : Number(val) });
            }}
            className="h-9 bg-[#1d1e2a] text-xs text-white shadow-xs"
          />
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-[#252736] shadow-xs hover:bg-[#2e3144] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Action Button: Create Task */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onNewTaskClick()}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-950/40 text-white font-medium"
        >
          New Task
        </Button>
      </div>
    </div>
  );
};
