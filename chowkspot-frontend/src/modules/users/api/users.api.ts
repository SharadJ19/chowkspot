import { fetchClient } from '@/lib/fetchClient';
import type { AuthUser, WorkerProfile } from '@/types';

export const usersApi = {
  getMe: () =>
    fetchClient<{ user: AuthUser; workerProfile: WorkerProfile | null }>('/users/me'),
  updateMe: (data: Record<string, unknown>) =>
    fetchClient<{ user: AuthUser; workerProfile: WorkerProfile | null }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
