import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-32 w-full rounded-xl',
    chart: 'h-64 w-full rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80 dark:bg-slate-800/80',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col gap-3',
      className
    )}
  >
    <div className="flex items-center justify-between">
      <Skeleton variant="rectangular" width={70} height={20} className="rounded-full" />
      <Skeleton variant="circular" width={24} height={24} />
    </div>
    <Skeleton variant="text" width="85%" height={18} />
    <Skeleton variant="text" width="60%" height={14} />
    <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
      <Skeleton variant="rectangular" width={60} height={16} />
      <Skeleton variant="circular" width={28} height={28} />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="flex items-center gap-4 py-3 px-4 border-b border-slate-100 dark:border-slate-800/60 animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={16}
        className={i === 0 ? 'w-1/3' : 'w-1/5'}
      />
    ))}
  </div>
);
