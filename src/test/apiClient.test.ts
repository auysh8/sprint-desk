import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../services/apiClient';

describe('apiClient HTTP Service & 401 Interception', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('injects in-memory Bearer token into Authorization header', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    globalThis.fetch = mockFetch as any;

    apiClient.setAuthHandlers({
      getAccessToken: () => 'test_mock_jwt_token_123',
      onTokenRefreshed: () => {},
      onAuthFailure: () => {},
    });

    const result = await apiClient.get<{ success: boolean }>('https://api.example.com/data');
    expect(result.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const passedHeaders = mockFetch.mock.calls[0][1].headers;
    expect(passedHeaders.get('Authorization')).toBe('Bearer test_mock_jwt_token_123');
  });

  it('skips Authorization header when skipAuth is true', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ openData: true }),
    });
    globalThis.fetch = mockFetch as any;

    apiClient.setAuthHandlers({
      getAccessToken: () => 'test_mock_jwt_token_123',
      onTokenRefreshed: () => {},
      onAuthFailure: () => {},
    });

    await apiClient.get('https://api.example.com/public', { skipAuth: true });
    const passedHeaders = mockFetch.mock.calls[0][1].headers;
    expect(passedHeaders.get('Authorization')).toBeNull();
  });
});
