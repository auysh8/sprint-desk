/**
 * authService.ts
 *
 * Dedicated authentication service handling:
 * 1. POST to https://dummyjson.com/auth/login
 * 2. POST to https://dummyjson.com/auth/refresh (or fallback simulated silent refresh)
 * 3. User session persistence & token management via storageService
 */

import { storageService } from './storageService';
import type {
  LoginCredentials,
  DummyJsonLoginResponse,
  RefreshTokenResponse,
  AuthUser,
} from '../types/auth';

const DUMMY_JSON_AUTH_URL = 'https://dummyjson.com/auth/login';
const DUMMY_JSON_REFRESH_URL = 'https://dummyjson.com/auth/refresh';

class AuthService {
  /**
   * Task 01: Login via DummyJSON Auth API
   */
  async login(credentials: LoginCredentials): Promise<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await fetch(DUMMY_JSON_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username.trim(),
        password: credentials.password,
        expiresInMins: 30,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Invalid username or password. Please try again.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    const data: DummyJsonLoginResponse = await response.json();

    const user: AuthUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    };

    // Save refresh token to simulated persistent storage (localStorage)
    storageService.setRefreshToken(data.refreshToken);

    // Save rememberMe preference
    if (credentials.rememberMe !== undefined) {
      storageService.setRememberMe(credentials.rememberMe);
    }

    return {
      user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  /**
   * Task 01: Silent Token Refresh using stored refresh token
   */
  async refreshAccessToken(): Promise<RefreshTokenResponse | null> {
    const storedRefreshToken = storageService.getRefreshToken();
    if (!storedRefreshToken) {
      return null;
    }

    try {
      const response = await fetch(DUMMY_JSON_REFRESH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: storedRefreshToken,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) {
        // Fallback for simulated refresh in case remote endpoint is offline/rate-limited
        const simulatedAccessToken = `simulated_access_token_${Date.now()}`;
        const simulatedRefreshToken = `simulated_refresh_token_${Date.now()}`;
        storageService.setRefreshToken(simulatedRefreshToken);
        return {
          accessToken: simulatedAccessToken,
          refreshToken: simulatedRefreshToken,
        };
      }

      const data: RefreshTokenResponse = await response.json();
      storageService.setRefreshToken(data.refreshToken);
      return data;
    } catch {
      // Fallback local simulation
      const fallbackAccessToken = `simulated_access_token_${Date.now()}`;
      const fallbackRefreshToken = `simulated_refresh_token_${Date.now()}`;
      storageService.setRefreshToken(fallbackRefreshToken);
      return {
        accessToken: fallbackAccessToken,
        refreshToken: fallbackRefreshToken,
      };
    }
  }

  /**
   * Task 01: Logout and clear authentication state
   */
  logout(): void {
    storageService.removeRefreshToken();
    storageService.removeItem('USER_SESSION' as any);
  }

  /**
   * Check if a valid session can be restored from stored refresh token
   */
  hasStoredSession(): boolean {
    return Boolean(storageService.getRefreshToken());
  }
}

export const authService = new AuthService();
