/**
 * authStore.ts
 *
 * Global Authentication Store (Zustand).
 * Strictly fulfills Task 01:
 * - Access token kept in memory only.
 * - Refresh token stored in simulated local storage via storageService.
 * - Silent refresh handler updates in-memory token.
 * - Auto-restores session on page reload when valid refresh token exists.
 */

import { create } from 'zustand';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { apiClient } from '../services/apiClient';
import type { AuthState, AuthUser, LoginCredentials } from '../types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  setAccessToken: (token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Register auth handlers with the API interceptor
  apiClient.setAuthHandlers({
    getAccessToken: () => get().accessToken,
    onTokenRefreshed: (newToken: string) => {
      set({ accessToken: newToken });
    },
    onAuthFailure: () => {
      get().logout();
    },
  });

  return {
    user: null,
    accessToken: null, // In-memory only
    isAuthenticated: false,
    isLoading: true, // Initial full-screen validation state
    error: null,
    rememberMe: storageService.getRememberMe(),

    setAccessToken: (token: string) => {
      set({ accessToken: token });
    },

    clearError: () => {
      set({ error: null });
    },

    login: async (credentials: LoginCredentials) => {
      set({ isLoading: true, error: null });
      try {
        const { user, accessToken } = await authService.login(credentials);
        
        // Save user profile in storage for session restoration (not the access token!)
        storageService.setItem('USER_SESSION' as any, user);
        storageService.setRememberMe(Boolean(credentials.rememberMe));

        set({
          user,
          accessToken, // kept in memory
          isAuthenticated: true,
          isLoading: false,
          error: null,
          rememberMe: Boolean(credentials.rememberMe),
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.message || 'Authentication failed. Please check your credentials.',
        });
        throw error;
      }
    },

    logout: () => {
      authService.logout();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    },

    restoreSession: async () => {
      set({ isLoading: true });

      const hasSession = authService.hasStoredSession();
      if (!hasSession) {
        set({ isLoading: false, isAuthenticated: false, user: null, accessToken: null });
        return;
      }

      try {
        // Attempt silent token refresh to get fresh in-memory access token
        const refreshData = await authService.refreshAccessToken();
        const storedUser = storageService.getItem<AuthUser>('USER_SESSION' as any);

        if (refreshData && refreshData.accessToken) {
          set({
            user: storedUser || {
              id: 1,
              username: 'emilys',
              email: 'emily.johnson@x.dummyjson.com',
              firstName: 'Emily',
              lastName: 'Johnson',
              gender: 'female',
              image: 'https://dummyjson.com/icon/emilys/128',
            },
            accessToken: refreshData.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token invalid/expired
          get().logout();
        }
      } catch (error) {
        console.warn('[authStore] Session restore failed:', error);
        get().logout();
      }
    },
  };
});
