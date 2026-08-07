import React, { useState } from 'react';
import {
  Users,
  Wrench,
  CalendarCheck,
  Star,
  Activity,
  Trash2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import type { AuthUser } from '@/types';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);

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
    },
  });

  if (statsLoading || usersLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '60vh',
          alignItems: 'center',
        }}
      >
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
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

      {/* Stats Grid */}
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
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'var(--color-status-accepted-bg)',
                color: 'var(--color-status-accepted-text)',
              }}
            >
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
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'var(--color-status-completed-bg)',
                color: 'var(--color-status-completed-text)',
              }}
            >
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
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'var(--color-status-pending-bg)',
                color: 'var(--color-status-pending-text)',
              }}
            >
              <Star size={20} />
            </div>
          </div>
          <span className={styles.statValue}>{stats?.totalReviews ?? 0}</span>
          <span className={styles.statFooter}>
            <ShieldCheck size={12} /> Strict Booking Guard
          </span>
        </div>
      </div>

      {/* User Moderation Table */}
      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Registered User &amp; Worker Directory</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList?.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700 }}>{u.name}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin User Delete Confirmation Modal */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title='Confirm User Account Removal'
      >
        {userToDelete && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm)',
                backgroundColor: 'var(--color-status-rejected-bg)',
                color: 'var(--color-status-rejected-text)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <AlertTriangle size={24} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
                Warning: Removing <strong>{userToDelete.name}</strong> (
                {userToDelete.email}) will permanently delete their profile, active worker
                listings, bookings, and submitted reviews.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                justifyContent: 'flex-end',
                marginTop: 'var(--spacing-xs)',
              }}
            >
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
