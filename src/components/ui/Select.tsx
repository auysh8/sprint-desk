import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold text-slate-200 select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-400 font-bold ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            value={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            className={cn(
              'w-full appearance-none rounded-xl bg-[#161619] px-3.5 py-2.5 pr-10 text-sm text-white transition-all duration-150 cursor-pointer shadow-xs',
              'focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-[#222226]',
              'disabled:bg-[#0c0c0e] disabled:text-neutral-600 disabled:cursor-not-allowed',
              error && 'ring-2 ring-rose-500/70',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error ? (
          <p id={`${selectId}-error`} className="text-xs text-rose-500 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
