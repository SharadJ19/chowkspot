// custom wrapper around native fetch.

import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

let accessTokenMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;
};

export const getAccessToken = () => accessTokenMemory;

interface RequestOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

export async function fetchClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { skipAuthRefresh = false, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (accessTokenMemory) {
    headers['Authorization'] = `Bearer ${accessTokenMemory}`;
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    credentials: 'include', // Ensures httpOnly refresh cookie is sent
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Auto Refresh Interceptor on 401
  if (response.status === 401 && !skipAuthRefresh && endpoint !== '/auth/refresh') {
    const refreshed = await tryRefreshToken();

    if (refreshed) {
      if (accessTokenMemory) {
        headers['Authorization'] = `Bearer ${accessTokenMemory}`;
      }
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        headers,
      });
    }
  }

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse JSON response from server',
  }));

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error ${response.status}`);
  }

  return data;
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      setAccessToken(null);
      return false;
    }

    const data: ApiResponse<{ accessToken: string }> = await res.json();
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return true;
    }
  } catch {
    setAccessToken(null);
  }
  return false;
}
