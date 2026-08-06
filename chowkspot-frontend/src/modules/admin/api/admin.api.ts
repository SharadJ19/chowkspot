import { fetchClient } from '@/lib/fetchClient';
import type { AuthUser } from '@/types';

export interface AdminStats {
  totalUsers: number;
  totalWorkers: number;
  totalBookings: number;
  completedBookings: number;
  totalReviews: number;
  recentBookings: {
    id: string;
    status: string;
    requestedDate: string;
    createdAt: string;
    address: string;
  }[];
}

export const adminApi = {
  getStats: () => fetchClient<AdminStats>('/admin/stats'),
  getUsers: () => fetchClient<AuthUser[]>('/admin/users'),
  deleteUser: (userId: string) =>
    fetchClient<{ message: string }>(`/admin/users/${userId}`, { method: 'DELETE' }),
};
