import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Undo2 } from 'lucide-react';
import { type ToastItem as ToastItemType } from '../../../types/common';
import { cn } from '../../../utils/cn';

export interface ToastItemProps {
  toast: ToastItemType;
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
};

const borderVariants = {
  success: 'border-l-4 border-l-emerald-500',
  error: 'border-l-4 border-l-rose-500',
  warning: 'border-l-4 border-l-amber-500',
  info: 'border-l-4 border-l-sky-500',
};

const progressVariants = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
};

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 5000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, onDismiss, toast.id]);

  return (
    <div
      role="alert"
      className={cn(
        'relative overflow-hidden w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 transition-all duration-200',
        'animate-in slide-in-from-bottom-5 fade-in duration-200',
        borderVariants[toast.type]
      )}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}

        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed break-words">
              {toast.message}
            </p>
          )}

          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Undo2 className="h-3.5 w-3.5" />
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className={cn('h-full transition-all linear', progressVariants[toast.type])}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
