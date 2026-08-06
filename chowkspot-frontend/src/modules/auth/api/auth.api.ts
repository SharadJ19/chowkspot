// src/modules/auth/api/auth.api.ts
import { fetchClient } from '@/lib/fetchClient';
import type { LoginInput, RegisterInput, AuthUser } from '@/types';

export const authApi = {
  login: (credentials: LoginInput) =>
    fetchClient<{ user: AuthUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuthRefresh: true,
    }),

  register: (data: RegisterInput) =>
    fetchClient<{ user: AuthUser; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuthRefresh: true,
    }),

  logout: () =>
    fetchClient('/auth/logout', {
      method: 'POST',
    }),

  verifyEmail: (data: { token: string; email: string }) =>
    fetchClient<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuthRefresh: true,
    }),

  forgotPassword: (data: { email: string }) =>
    fetchClient<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuthRefresh: true,
    }),

  resetPassword: (data: { token: string; email: string; newPassword: string }) =>
    fetchClient<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuthRefresh: true,
    }),
};
