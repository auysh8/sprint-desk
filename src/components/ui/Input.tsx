import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      value,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-slate-200 select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-400 font-bold ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            value={value}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full rounded-xl bg-[#1d1e2a] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:bg-[#252736]',
              'disabled:bg-[#15161f] disabled:text-slate-500 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : '',
              isPassword || clearable || rightIcon ? 'pr-10' : '',
              error && 'ring-2 ring-rose-500/70',
              className
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5 text-slate-400">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear input"
                className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {isPassword && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}

            {!isPassword && rightIcon && (
              <div className="pointer-events-none">{rightIcon}</div>
            )}
          </div>
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-500 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
