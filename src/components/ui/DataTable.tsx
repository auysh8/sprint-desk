import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './Input';
import { SkeletonTableRow } from './Skeleton';
import { cn } from '../../utils/cn';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchFilterKeys?: (keyof T)[];
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilterKeys,
  isLoading = false,
  pageSize = 10,
  emptyMessage = 'No records found',
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      if (searchFilterKeys && searchFilterKeys.length > 0) {
        return searchFilterKeys.some((key) => {
          const val = item[key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        });
      }

      return Object.values(item).some(
        (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, searchFilterKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const accessor = col.accessorKey || (col.key as keyof T);
      const valA = a[accessor];
      const valB = b[accessor];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortOrder === 'asc' ? (valA < valB ? -1 : 1) : valA > valB ? -1 : 1;
    });
  }, [filteredData, sortKey, sortOrder, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={cn('w-full flex flex-col gap-3.5', className)}>
      {/* Top Search bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-xs w-full">
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="h-4 w-4 text-neutral-400" />}
            clearable
            onClear={() => setSearchQuery('')}
            className="h-10 bg-[#161619] text-white placeholder:text-neutral-500 font-medium rounded-xl shadow-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-semibold">
          Showing {sortedData.length} tasks
        </span>
      </div>

      {/* Table Container with Stable Minimum Height to Prevent Layout Shifts */}
      <div className="w-full overflow-x-auto rounded-3xl bg-[#0c0c0e] shadow-xl shadow-black/80 min-h-[460px] flex flex-col justify-between border-0">
        <table className="w-full text-left border-collapse text-sm table-fixed min-w-[700px]">
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-[#161619]">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={cn(
                      'px-4 py-3.5 text-xs font-bold text-neutral-300 select-none uppercase tracking-wider',
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-white font-bold focus:outline-none transition-colors cursor-pointer"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-white" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500 opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length} className="p-0">
                    <SkeletonTableRow columns={columns.length} />
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-neutral-500 text-sm font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="wait">
                {paginatedData.map((item, index) => {
                  const rowKey = item.id ? String(item.id) : index;
                  return (
                    <motion.tr
                      key={`${currentPage}-${rowKey}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, delay: index * 0.015 }}
                      onClick={() => onRowClick?.(item)}
                      className={cn(
                        'hover:bg-[#161619] transition-colors h-[54px]',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {columns.map((col) => {
                        const accessor = col.accessorKey || (col.key as keyof T);
                        const content = col.cell ? col.cell(item) : (item[accessor] as React.ReactNode);

                        return (
                          <td
                            key={col.key}
                            className={cn(
                              'px-4 py-3.5 text-neutral-200 text-sm align-middle',
                              col.align === 'center'
                                ? 'text-center'
                                : col.align === 'right'
                                ? 'text-right'
                                : 'text-left'
                            )}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-xs text-neutral-400 font-medium">
            Page <span className="text-white font-bold">{currentPage}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl bg-[#161619] text-white hover:bg-[#222226] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl bg-[#161619] text-white hover:bg-[#222226] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
