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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-2">
      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            leftIcon={<Search className="h-4 w-4 text-neutral-400" />}
            clearable
            onClear={() => setFilters({ searchQuery: '' })}
            className="h-10 bg-[#161619] text-white placeholder:text-neutral-400 font-medium rounded-xl shadow-xs"
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
            className="h-10 bg-[#161619] text-xs font-semibold text-white rounded-xl shadow-xs"
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
            className="h-10 bg-[#161619] text-xs font-semibold text-white rounded-xl shadow-xs"
          />
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white px-3 py-2 rounded-xl bg-[#222226] shadow-xs hover:bg-[#2c2c32] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Action Button: Create Task */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="primary"
          size="md"
          onClick={() => onNewTaskClick()}
          leftIcon={<Plus className="h-4 w-4 stroke-[2.5]" />}
          className="bg-white hover:bg-neutral-100 active:bg-neutral-200 text-black font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-white/10"
        >
          Create Task
        </Button>
      </div>
    </div>
  );
};
