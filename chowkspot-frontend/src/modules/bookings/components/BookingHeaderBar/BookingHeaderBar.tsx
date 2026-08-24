import React from 'react';
import { Wrench, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './BookingHeaderBar.module.css';

interface BookingHeaderBarProps {
  isWorkerRole: boolean;
  totalCount: number;
}

export const BookingHeaderBar: React.FC<BookingHeaderBarProps> = ({
  isWorkerRole,
  totalCount,
}) => {
  return (
    <header className={styles.headerCard}>
      <div className={styles.titleArea}>
        <div className={styles.titleIcon}>
          {isWorkerRole ? <Wrench size={20} /> : <CalendarIcon size={20} />}
        </div>
        <div>
          <h1 className={styles.mainHeading}>
            {isWorkerRole ? 'Service Command Workspace' : 'My Service Bookings'}
          </h1>
          <p className={styles.subHeading}>
            {isWorkerRole
              ? 'Accept jobs, manage lifecycle & direct P2P settlements'
              : 'Track active appointments & settle commission-free UPI payments'}
          </p>
        </div>
      </div>

      <div className={styles.statusIndicator}>
        <span className={styles.pulseDot} />
        <Badge variant={isWorkerRole ? 'primary' : 'secondary'}>
          <ShieldCheck size={13} />
          <span>
            {isWorkerRole ? 'Worker Mode' : 'Customer Account'} • {totalCount} Total
          </span>
        </Badge>
      </div>
    </header>
  );
};
