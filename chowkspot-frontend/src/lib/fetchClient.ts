import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// In-memory token storage for the active user session
let accessTokenMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;
};

export const getAccessToken = () => accessTokenMemory;

interface RequestOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

/**
 * Custom wrapper around native fetch designed to handle JSON payloads,
 * authorization headers, automatic token rotation, and safe cold-start parsing.
 */
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
    credentials: 'include', // Ensures httpOnly refresh cookie is transmitted correctly
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Auto-refresh token interceptor on 401 Unauthorized responses
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

  // Read response body as raw text first to handle empty or HTML gateway error pages safely
  const responseText = await response.text();

  let data: ApiResponse<T>;
  try {
    data = responseText
      ? JSON.parse(responseText)
      : { success: false, message: `HTTP Error ${response.status}` };
  } catch {
    // This catches HTML pages or non-JSON payloads returned by server proxies/gateways during cold starts
    data = {
      success: false,
      message:
        response.status === 502 || response.status === 503
          ? 'Server is waking up from a cold start. Please try your request again.'
          : `Server returned an invalid response format (HTTP ${response.status})`,
    };
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error ${response.status}`);
  }

  return data;
}

/**
 * Helper function to trigger a token refresh attempt when an access token expires.
 */
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
