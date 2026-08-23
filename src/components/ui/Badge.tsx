import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'tag'
  | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-[#191c24] text-slate-300 border-white/5',
  primary:
    'bg-purple-500/15 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
  success:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning:
    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger:
    'bg-rose-500/15 text-rose-400 border-rose-500/30',
  info:
    'bg-sky-500/15 text-sky-400 border-sky-500/30',
  tag:
    'bg-[#1c1e28] text-slate-300 border-white/5 font-normal tracking-normal',
  outline:
    'bg-transparent text-slate-400 border-slate-700/80',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  primary: 'bg-purple-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-sky-400',
  tag: 'bg-slate-400',
  outline: 'bg-slate-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 font-medium gap-1 rounded-md',
  md: 'text-xs px-2.5 py-0.5 font-medium gap-1.5 rounded-md',
  lg: 'text-sm px-3 py-1 font-semibold gap-1.5 rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border transition-all duration-150',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
