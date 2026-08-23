import React, { createContext, useContext, useState, useCallback } from 'react';
import { type ToastItem, type ToastType } from '../../../types/common';
import { ToastItem as ToastItemComponent } from './ToastItem';

export interface ShowToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string, options?: Partial<ShowToastOptions>) => string;
  error: (title: string, message?: string, options?: Partial<ShowToastOptions>) => string;
  warning: (title: string, message?: string, options?: Partial<ShowToastOptions>) => string;
  info: (title: string, message?: string, options?: Partial<ShowToastOptions>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = {
      id,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      action: options.action,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const success = useCallback(
    (title: string, message?: string, options?: Partial<ShowToastOptions>) =>
      showToast({ ...options, title, message, type: 'success' }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<ShowToastOptions>) =>
      showToast({ ...options, title, message, type: 'error' }),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<ShowToastOptions>) =>
      showToast({ ...options, title, message, type: 'warning' }),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<ShowToastOptions>) =>
      showToast({ ...options, title, message, type: 'info' }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        clearAll,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      {/* Fixed Toast Viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto"
      >
        {toasts.map((toast) => (
          <ToastItemComponent key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
