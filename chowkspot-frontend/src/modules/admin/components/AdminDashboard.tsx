// FILE: src/modules/admin/components/AdminDashboard.tsx
import React, { useState, useMemo } from 'react';
import {
  Users,
  Wrench,
  CalendarCheck,
  Star,
  Activity,
  Trash2,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Modal } from '@/components/ui/Modal/Modal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import type { AuthUser } from '@/types';
import styles from './AdminDashboard.module.css';
import modStyles from './AdminDashboard.module.css';

const USERS_PER_PAGE = 10;

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
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

  const { data: usersList, isLoading: usersLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      return res.data || [];
    },
  });

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

  const filteredUsers = useMemo(() => {
    if (!usersList) return [];
    return usersList.filter((u) => {
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.city.toLowerCase().includes(query) ||
        u.phone.includes(query);

      return matchesRole && matchesSearch;
    });
  }, [usersList, searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleRoleTabChange = (role: 'ALL' | 'USER' | 'WORKER' | 'ADMIN') => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (statsLoading || usersLoading) {
    return (
      <div className={modStyles.centerLoading}>
        <Spinner size='lg' />
      </div>
    );
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

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Customers</span>
            <div className={styles.iconWrapper}>
              <Users size={20} />
            </div>
          </div>
          <span className={styles.statValue}>{stats?.totalUsers ?? 0}</span>
          <span className={styles.statFooter}>
            <ShieldCheck size={12} /> Verified Accounts
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Skilled Workers</span>
            <div className={styles.iconWrapper}>
              <Wrench size={20} />
            </div>
          </div>
          <span className={styles.statValue}>{stats?.totalWorkers ?? 0}</span>
          <span className={styles.statFooter}>
            <ShieldCheck size={12} /> Active Regional Hubs
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Bookings</span>
            <div className={styles.iconWrapper}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <span className={styles.statValue}>{stats?.totalBookings ?? 0}</span>
          <span className={styles.statFooter}>
            <ShieldCheck size={12} /> {stats?.completedBookings ?? 0} Completed
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Verified Reviews</span>
            <div className={styles.iconWrapper}>
              <Star size={20} />
            </div>
          </div>
          <span className={styles.statValue}>{stats?.totalReviews ?? 0}</span>
          <span className={styles.statFooter}>
            <ShieldCheck size={12} /> Strict Booking Guard
          </span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeaderRow}>
          <div>
            <h3 className={styles.panelTitle}>Registered User Directory</h3>
            <span className={styles.directoryCountText}>
              Showing {filteredUsers.length} of {usersList?.length || 0} registered
              accounts
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

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className={modStyles.tableEmptyCell}>
                    No accounts match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <Avatar name={u.name} src={u.avatarUrl} size='sm' />
                        <span className={styles.userNameText}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.city}</td>
                    <td>
                      <Badge
                        variant={
                          u.role === 'ADMIN'
                            ? 'danger'
                            : u.role === 'WORKER'
                              ? 'primary'
                              : 'secondary'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td>
                      {u.isVerified ? (
                        <span className={styles.verifiedTag}>
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      ) : (
                        <span className={styles.unverifiedTag}>
                          <XCircle size={13} /> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      {u.role !== 'ADMIN' && (
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => setUserToDelete(u)}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title='Confirm User Account Removal'
      >
        {userToDelete && (
          <div className={modStyles.modalContent}>
            <div className={modStyles.warningBox}>
              <AlertTriangle size={24} />
              <p className={modStyles.warningText}>
                Warning: Removing <strong>{userToDelete.name}</strong> (
                {userToDelete.email}) will permanently delete their profile, active worker
                listings, bookings, and submitted reviews.
              </p>
            </div>

            <div className={modStyles.modalButtonRow}>
              <Button
                variant='outline'
                onClick={() => setUserToDelete(null)}
                disabled={deleteUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant='danger'
                isLoading={deleteUserMutation.isPending}
                onClick={() => deleteUserMutation.mutate(userToDelete.id)}
              >
                Permanently Remove
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
