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
    'bg-[#161619] text-neutral-300 border-0',
  primary:
    'bg-white/10 text-white border-0',
  success:
    'bg-emerald-500/20 text-emerald-300 border-0',
  warning:
    'bg-amber-500/20 text-amber-300 border-0',
  danger:
    'bg-rose-500/20 text-rose-300 border-0',
  info:
    'bg-sky-500/20 text-sky-300 border-0',
  tag:
    'bg-[#161619] text-neutral-300 border-0 font-normal tracking-normal',
  outline:
    'bg-transparent text-neutral-400 border border-neutral-700',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-neutral-400',
  primary: 'bg-white',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-sky-400',
  tag: 'bg-neutral-400',
  outline: 'bg-neutral-400',
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
