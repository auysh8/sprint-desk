import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../components/ui/Toast/ToastContext';

describe('useToast hook & ToastContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  it('adds success toast to state', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.success('Operation Successful', 'All items loaded');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Operation Successful');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('dismisses a specific toast by ID', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let toastId = '';
    act(() => {
      toastId = result.current.info('Notification Title', 'Message details');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismissToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('clears all active toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.warning('Warning 1');
      result.current.error('Error 2');
    });

    expect(result.current.toasts.length).toBeGreaterThanOrEqual(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('supports action callback on toast', () => {
    const actionSpy = vi.fn();
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast({
        title: 'Task Moved',
        action: {
          label: 'Undo',
          onClick: actionSpy,
        },
      });
    });

    const activeToast = result.current.toasts[0];
    expect(activeToast.action).toBeDefined();
    expect(activeToast.action?.label).toBe('Undo');

    act(() => {
      activeToast.action?.onClick();
    });

    expect(actionSpy).toHaveBeenCalledTimes(1);
  });
});
