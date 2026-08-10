import React, { useState, useEffect, useCallback } from 'react';
import type { AuthUser, LoginInput, RegisterInput } from '@/types';
import { fetchClient, setAccessToken } from '@/lib/fetchClient';
import { initializeSocket, disconnectSocket } from '@/lib/socket';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      const refreshRes = await fetchClient<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
        skipAuthRefresh: true,
      });

      if (refreshRes.success && refreshRes.data?.accessToken) {
        const token = refreshRes.data.accessToken;
        setAccessToken(token);
        initializeSocket(token);

        const meRes = await fetchClient<{ user: AuthUser }>('/users/me');
        if (meRes.success && meRes.data?.user) {
          setUser(meRes.data.user);
        }
      }
    } catch (err) {
      const errMsg = (err as Error).message.toLowerCase();

      const isColdStartOrNetworkError =
        errMsg.includes('cold start') ||
        errMsg.includes('502') ||
        errMsg.includes('503') ||
        errMsg.includes('failed to fetch') ||
        errMsg.includes('networkerror');

      if (!isColdStartOrNetworkError) {
        setAccessToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      if (isMounted) {
        await checkAuth();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  const login = async (credentials: LoginInput) => {
    const res = await fetchClient<{ user: AuthUser; accessToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
        skipAuthRefresh: true,
      },
    );

    if (res.success && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      initializeSocket(res.data.accessToken);
    }
  };

  const register = async (data: RegisterInput) => {
    const res = await fetchClient<{ user: AuthUser; accessToken: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuthRefresh: true,
      },
    );

    if (res.success && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      initializeSocket(res.data.accessToken);
    }
  };

  const logout = async () => {
    try {
      await fetchClient('/auth/logout', { method: 'POST' });
    } catch {
      // Silently handle error during logout
    } finally {
      setAccessToken(null);
      setUser(null);
      disconnectSocket();
    }
  };

  const refetchUser = async () => {
    const meRes = await fetchClient<{ user: AuthUser }>('/users/me');
    if (meRes.success && meRes.data?.user) {
      setUser(meRes.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
