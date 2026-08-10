import React from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar } from 'lucide-react';
import type { WorkerSearchResult } from '@/types';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './WorkerCard.module.css';

export interface WorkerCardProps {
  worker: WorkerSearchResult;
  onBookClick?: (worker: WorkerSearchResult) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onBookClick }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div>
        <div className={styles.header}>
          <Avatar name={worker.user.name} src={worker.user.avatarUrl} size='lg' />
          <div className={styles.info}>
            <div className={styles.topLine}>
              <span className={styles.name}>{worker.user.name}</span>
              <Badge variant={worker.isAvailable ? 'success' : 'muted'}>
                {worker.isAvailable ? 'Available' : 'Busy'}
              </Badge>
            </div>
            <span className={styles.category}>{worker.category}</span>

            <div className={styles.citiesList}>
              <MapPin
                size={12}
                style={{ color: 'var(--color-primary-600)', flexShrink: 0 }}
              />
              {worker.serviceCities.map((city) => (
                <span key={city} className={styles.cityBadge}>
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className={styles.bio}>
          {worker.bio ||
            'Experienced skilled professional available for immediate local hire.'}
        </p>

        <div className={styles.middleSection}>
          <div className={styles.ratingRow}>
            <RatingStars rating={parseFloat(worker.avgRating)} showValue />
            <span className={styles.reviewCount}>({worker.totalReviews})</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.rateWrapper}>
          <span className={styles.rate}>{formatCurrency(worker.baseRate)}</span>
          <span className={styles.rateType}>{worker.rateType}</span>
        </div>
        <div className={styles.actionGroup}>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/worker/${worker.id}`)}
          >
            Profile
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => onBookClick?.(worker)}
            disabled={!worker.isAvailable}
          >
            <Calendar size={13} />
            <span>Book</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
