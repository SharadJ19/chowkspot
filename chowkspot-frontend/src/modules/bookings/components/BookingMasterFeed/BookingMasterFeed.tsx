import React from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { Input } from '@/components/ui/Input/Input';
import { formatDate } from '@/utils/formatDate';
import type { CustomerBookingItem, WorkerBookingItem } from '@/types';
import styles from './BookingMasterFeed.module.css';

interface BookingMasterFeedProps {
  feed: (CustomerBookingItem | WorkerBookingItem)[];
  selectedId: string | null;
  searchQuery: string;
  isWorkerRole: boolean;
  onSearchChange: (query: string) => void;
  onSelect: (bookingId: string) => void;
}

export const BookingMasterFeed: React.FC<BookingMasterFeedProps> = ({
  feed,
  selectedId,
  searchQuery,
  isWorkerRole,
  onSearchChange,
  onSelect,
}) => {
  return (
    <aside className={styles.masterPane}>
      <div className={styles.searchBox}>
        <Input
          placeholder='Filter by name, skill, address...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          rightElement={<Search size={14} />}
        />
      </div>

      <div className={styles.feedList}>
        {feed.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.75rem',
            }}
          >
            No bookings found.
          </div>
        ) : (
          feed.map((item) => {
            const isSelected = selectedId === item.booking.id;

            // Safe property extraction checking actual payload keys
            const customerUser = 'user' in item ? item.user : undefined;
            const workerProfile =
              'workerProfile' in item ? item.workerProfile : undefined;

            const title = isWorkerRole
              ? customerUser?.name || 'Customer'
              : workerProfile?.category || 'Service';

            const avatar = isWorkerRole ? customerUser?.avatarUrl : undefined;

            return (
              <div
                key={item.booking.id}
                className={`${styles.bookingRowItem} ${isSelected ? styles.bookingRowItemActive : ''}`}
                onClick={() => onSelect(item.booking.id)}
              >
                <div className={styles.rowHeader}>
                  <div className={styles.rowParticipant}>
                    <Avatar name={title} src={avatar} size='sm' />
                    <div>
                      <span className={styles.rowName}>{title}</span>
                      <span className={styles.rowCategory}>
                        {item.booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.booking.status === 'COMPLETED'
                        ? 'success'
                        : item.booking.status === 'PENDING'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {item.booking.status}
                  </Badge>
                </div>
                <div className={styles.rowFooter}>
                  <span>{formatDate(item.booking.requestedDate, 'short')}</span>
                  <span>
                    {item.booking.address
                      ? `${item.booking.address.slice(0, 20)}...`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
