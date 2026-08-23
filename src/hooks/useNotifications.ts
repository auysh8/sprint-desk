import { useEffect, useRef, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useNotificationStore } from '../store/notificationStore';
import { useToast } from '../components/ui/Toast/ToastContext';

const POLLING_INTERVAL_MS = 20000; // Poll every 20 seconds when tab is active

export function useNotifications() {
  const {
    notifications,
    loadInitialNotifications,
    addNotification,
  } = useNotificationStore();

  const { info } = useToast();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingActiveRef = useRef<boolean>(true);

  // Initialize initial notifications
  useEffect(() => {
    loadInitialNotifications();
  }, [loadInitialNotifications]);

  const pollForUpdates = useCallback(async () => {
    // If browser tab is hidden or polling paused, do nothing
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    try {
      const posts = await notificationService.fetchRecentPosts();
      const currentSeen = useNotificationStore.getState().seenPostIds;

      // Find novel posts not yet seen
      const newPosts = posts.filter((post) => !currentSeen.includes(post.id));

      if (newPosts.length > 0) {
        // Pick the latest new post to ingest and notify
        const latestPost = newPosts[0];
        const notificationItem = notificationService.transformPostToNotification(latestPost);

        addNotification(notificationItem);

        // Show toast alert only if dropdown is currently closed
        if (!useNotificationStore.getState().isDropdownOpen) {
          info(notificationItem.title, notificationItem.message, {
            duration: 6000,
          });
        }
      }
    } catch (error) {
      console.warn('[useNotifications] Polling check skipped or failed:', error);
    }
  }, [addNotification, info]);

  // Tab visibility management & interval timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        isPollingActiveRef.current = true;
        // Immediate fetch upon returning to the active tab
        pollForUpdates();
        // Start polling interval
        if (!timerRef.current) {
          timerRef.current = setInterval(pollForUpdates, POLLING_INTERVAL_MS);
        }
      } else {
        // Pause polling completely while hidden
        isPollingActiveRef.current = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    // Initial start
    if (document.visibilityState === 'visible') {
      timerRef.current = setInterval(pollForUpdates, POLLING_INTERVAL_MS);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pollForUpdates]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    refetchNow: pollForUpdates,
  };
}
