import React from 'react';
import { Users, Wrench, CalendarCheck, Star, ShieldCheck } from 'lucide-react';
import type { AdminStats } from '@/modules/admin/api/admin.api';
import styles from './AdminStatsGrid.module.css';

interface AdminStatsGridProps {
  stats: AdminStats | undefined;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  return (
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
  );
};
