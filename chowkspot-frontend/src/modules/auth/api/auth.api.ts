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
};
