/**
 * apiClient.ts
 *
 * Centralized HTTP Client with:
 * 1. Automatic Bearer token injection from in-memory AuthStore.
 * 2. Response 401 Interception with silent token refresh & request retry queue.
 * 3. Token expiration simulation support (Task 01 requirement).
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  retryCount?: number;
}

interface QueuedPromise {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: QueuedPromise[] = [];
  private getAccessTokenFn: (() => string | null) | null = null;
  private onTokenRefreshedFn: ((token: string) => void) | null = null;
  private onAuthFailureFn: (() => void) | null = null;
  private simulateExpiryNextRequest = false;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Register auth callbacks without cyclic dependency between apiClient and authStore.
   */
  setAuthHandlers(handlers: {
    getAccessToken: () => string | null;
    onTokenRefreshed: (newToken: string) => void;
    onAuthFailure: () => void;
  }) {
    this.getAccessTokenFn = handlers.getAccessToken;
    this.onTokenRefreshedFn = handlers.onTokenRefreshed;
    this.onAuthFailureFn = handlers.onAuthFailure;
  }

  /**
   * Task 01 Bonus/Requirement: Trigger a simulated expired token on the next outgoing request.
   */
  simulateTokenExpiry() {
    this.simulateExpiryNextRequest = true;
  }

  private processQueue(error: unknown | null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const urlString = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    if (!params) return urlString;

    const url = new URL(urlString, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    return url.toString();
  }

  /**
   * Core request handler with automatic token injection and retry interceptor.
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, skipAuth = false, retryCount = 0, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers = new Headers(fetchOptions.headers || {});
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Task 01: Attach in-memory Bearer token
    if (!skipAuth && this.getAccessTokenFn) {
      const token = this.getAccessTokenFn();
      if (token) {
        // Check for simulated expiry
        if (this.simulateExpiryNextRequest) {
          this.simulateExpiryNextRequest = false;
          headers.set('Authorization', 'Bearer EXPIRED_SIMULATED_TOKEN');
        } else {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Intercept 401 Unauthorized for silent token refresh
      if (response.status === 401 && !skipAuth && retryCount === 0) {
        return this.handle401AndRetry<T>(endpoint, options);
      }

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignore JSON parse error on non-json responses
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 401 Silent Token Refresh & Request Queue Interceptor
   */
  private async handle401AndRetry<T>(endpoint: string, originalOptions: RequestOptions): Promise<T> {
    if (this.isRefreshing) {
      // If refresh is in-flight, wait in the queue for the new token
      return new Promise<string>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => {
        return this.request<T>(endpoint, {
          ...originalOptions,
          retryCount: (originalOptions.retryCount || 0) + 1,
        });
      });
    }

    this.isRefreshing = true;

    try {
      // Execute silent refresh via DummyJSON refresh endpoint or simulated refresh
      const { authService } = await import('./authService');
      const refreshResult = await authService.refreshAccessToken();

      if (refreshResult && refreshResult.accessToken) {
        if (this.onTokenRefreshedFn) {
          this.onTokenRefreshedFn(refreshResult.accessToken);
        }

        this.processQueue(null, refreshResult.accessToken);

        // Retry original request with incremented retry count
        return this.request<T>(endpoint, {
          ...originalOptions,
          retryCount: (originalOptions.retryCount || 0) + 1,
        });
      } else {
        throw new Error('Failed to refresh authentication token');
      }
    } catch (refreshError) {
      this.processQueue(refreshError, null);
      if (this.onAuthFailureFn) {
        this.onAuthFailureFn();
      }
      throw refreshError;
    } finally {
      this.isRefreshing = false;
    }
  }

  // --- Convenience HTTP Helpers ---

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
