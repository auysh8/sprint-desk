import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationItem } from '../types/notification';
import { mockDataService } from '../services/mockDataService';

interface NotificationState {
  notifications: NotificationItem[];
  seenPostIds: number[];
  isDropdownOpen: boolean;

  // Actions
  loadInitialNotifications: () => Promise<void>;
  setIsDropdownOpen: (open: boolean) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: NotificationItem) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      seenPostIds: [],
      isDropdownOpen: false,

      loadInitialNotifications: async () => {
        const state = get();
        if (state.notifications.length > 0) return;

        try {
          const initial = await mockDataService.getInitialNotifications();
          set({ notifications: initial });
        } catch (error) {
          console.error('[notificationStore] Failed to load initial notifications:', error);
        }
      },

      setIsDropdownOpen: (open: boolean) => set({ isDropdownOpen: open }),

      markAsRead: (id: number) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      addNotification: (item: NotificationItem) => {
        const state = get();
        const exists = state.notifications.some((n) => n.id === item.id);
        if (exists) return;

        const newSeen = item.sourcePostId
          ? [...state.seenPostIds, item.sourcePostId]
          : state.seenPostIds;

        set({
          notifications: [item, ...state.notifications],
          seenPostIds: newSeen,
        });
      },
    }),
    {
      name: 'sprintdesk_notification_store',
      partialize: (state) => ({
        notifications: state.notifications,
        seenPostIds: state.seenPostIds,
      }),
    }
  )
);
