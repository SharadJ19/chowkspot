import React, { useState } from 'react';
import { Activity, Search } from 'lucide-react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Pagination } from '@/components/ui/Pagination/Pagination';

import { AdminStatsGrid } from './AdminStatsGrid/AdminStatsGrid';
import { AdminUserTable } from './AdminUserTable/AdminUserTable';
import { AdminDeleteModal } from './AdminDeleteModal/AdminDeleteModal';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';

import type { AuthUser } from '@/types';
import styles from './AdminDashboard.module.css';

const USERS_PER_PAGE = 10;

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'WORKER' | 'ADMIN'>(
    'ALL',
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const res = await adminApi.getStats();
      return res.data;
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin_users', currentPage, roleFilter, debouncedSearch],
    queryFn: async () => {
      const res = await adminApi.getUsers({
        page: currentPage,
        limit: USERS_PER_PAGE,
        role: roleFilter,
        search: debouncedSearch,
      });
      return (
        res.data || {
          users: [],
          pagination: { total: 0, page: 1, limit: USERS_PER_PAGE, totalPages: 1 },
        }
      );
    },
    placeholderData: keepPreviousData,
  });

  const usersList = usersData?.users || [];
  const pagination = usersData?.pagination || {
    total: 0,
    page: 1,
    limit: USERS_PER_PAGE,
    totalPages: 1,
  };

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      setUserToDelete(null);
      toast.success('User account permanently removed.');
    },
    onError: (err) => {
      toast.error('Failed to remove user account', {
        description: (err as Error).message,
      });
    },
  });

  const handleRoleTabChange = (role: 'ALL' | 'USER' | 'WORKER' | 'ADMIN') => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (statsLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Platform Command Center</h1>
          <p className={styles.pageSubtitle}>
            System health, marketplace metrics, and user moderation
          </p>
        </div>
        <Badge variant='success'>
          <Activity size={12} />
          <span>Live Operations Normal</span>
        </Badge>
      </div>

      <AdminStatsGrid stats={stats} />

      <div className={styles.panel}>
        <div className={styles.panelHeaderRow}>
          <div>
            <h3 className={styles.panelTitle}>Registered User Directory</h3>
            <span className={styles.directoryCountText}>
              Showing {usersList.length} of {pagination.total} registered accounts
            </span>
          </div>

          <div className={styles.directorySearchWrapper}>
            <Input
              placeholder='Search name, email, city, phone...'
              value={searchQuery}
              onChange={handleSearchChange}
              rightElement={<Search size={16} />}
            />
          </div>
        </div>

        <div className={styles.tabsRow}>
          {(['ALL', 'USER', 'WORKER', 'ADMIN'] as const).map((role) => (
            <Button
              key={role}
              size='sm'
              variant={roleFilter === role ? 'primary' : 'outline'}
              onClick={() => handleRoleTabChange(role)}
            >
              {role === 'ALL'
                ? 'All Accounts'
                : role === 'USER'
                  ? 'Customers'
                  : role === 'WORKER'
                    ? 'Workers'
                    : 'Admins'}
            </Button>
          ))}
        </div>

        <AdminUserTable
          users={usersList}
          isLoading={usersLoading}
          onSelectDelete={(user) => setUserToDelete(user)}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AdminDeleteModal
        userToDelete={userToDelete}
        isOpen={Boolean(userToDelete)}
        isPending={deleteUserMutation.isPending}
        onClose={() => setUserToDelete(null)}
        onConfirm={(userId) => deleteUserMutation.mutate(userId)}
      />
    </div>
  );
};
