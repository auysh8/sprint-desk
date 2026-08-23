/**
 * storageService.ts
 *
 * Safe abstraction over browser storage (localStorage / sessionStorage).
 * Prevents runtime crashes in private mode or restricted environments,
 * encapsulates serialization, and avoids magic string keys across the codebase.
 */

const STORAGE_KEYS = {
  REFRESH_TOKEN: 'sprintdesk_refresh_token',
  USER_SESSION: 'sprintdesk_user_session',
  REMEMBER_ME: 'sprintdesk_remember_me',
  BOARD_STATE: 'sprintdesk_board_state',
  NOTIFICATIONS: 'sprintdesk_notifications',
  THEME: 'sprintdesk_theme',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

class StorageService {
  /**
   * Safely retrieve and parse a value from localStorage.
   */
  getItem<T>(key: (typeof STORAGE_KEYS)[StorageKey], defaultValue: T | null = null): T | null {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null || rawValue === undefined) {
        return defaultValue;
      }
      return JSON.parse(rawValue) as T;
    } catch (error) {
      console.warn(`[storageService] Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Safely serialize and store a value in localStorage.
   */
  setItem<T>(key: (typeof STORAGE_KEYS)[StorageKey], value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storageService] Error writing key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove a specific key from localStorage.
   */
  removeItem(key: (typeof STORAGE_KEYS)[StorageKey]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[storageService] Error removing key "${key}":`, error);
    }
  }

  /**
   * Clear all application-specific keys from storage without wiping unrelated keys.
   */
  clearAppStorage(): void {
    if (typeof window === 'undefined') return;

    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }

  // --- Convenience Helpers for Common Entities ---

  getRefreshToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): boolean {
    return this.setItem<string>(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  removeRefreshToken(): void {
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  getRememberMe(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.REMEMBER_ME, false) ?? false;
  }

  setRememberMe(remember: boolean): boolean {
    return this.setItem<boolean>(STORAGE_KEYS.REMEMBER_ME, remember);
  }

  getTheme(): 'light' | 'dark' | null {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME);
  }

  setTheme(theme: 'light' | 'dark'): boolean {
    return this.setItem<'light' | 'dark'>(STORAGE_KEYS.THEME, theme);
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
