import React from 'react';
import type { CustomerBookingItem, WorkerBookingItem } from '@/types';
import styles from './BookingFilterTabs.module.css';

interface BookingFilterTabsProps {
  activeTab: string;
  items: (CustomerBookingItem | WorkerBookingItem)[];
  onTabChange: (tab: string) => void;
}

const TAB_CONFIGS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export const BookingFilterTabs: React.FC<BookingFilterTabsProps> = ({
  activeTab,
  items,
  onTabChange,
}) => {
  return (
    <nav className={styles.filterContainer} aria-label='Filter bookings by status'>
      {TAB_CONFIGS.map((tab) => {
        const count =
          tab.key === 'ALL'
            ? items.length
            : items.filter((i) => i.booking.status === tab.key).length;

        return (
          <button
            key={tab.key}
            type='button'
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <span>{tab.label}</span>
            <span className={styles.tabCount}>{count}</span>
          </button>
        );
      })}
    </nav>
  );
};
