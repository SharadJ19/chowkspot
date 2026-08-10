import { fetchClient } from '@/lib/fetchClient';
import type { AuthUser } from '@/types';

export interface AdminUsersResponse {
  users: AuthUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.role) query.append('role', params.role);
    if (params?.search) query.append('search', params.search);

    return fetchClient<AdminUsersResponse>(`/admin/users?${query.toString()}`);
  },
  deleteUser: (userId: string) =>
    fetchClient<{ message: string }>(`/admin/users/${userId}`, { method: 'DELETE' }),
};
