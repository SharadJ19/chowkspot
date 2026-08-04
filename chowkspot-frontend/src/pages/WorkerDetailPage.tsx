import React from 'react';
import { useParams } from 'react-router';
import { MapPin } from 'lucide-react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { ReviewList } from '@/modules/reviews/components/ReviewList/ReviewList';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './Pages.module.css';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { searchWorkersQuery } = useWorkerQueries();
  const { reviewsQuery } = useReviewQueries(id);

  const worker = searchWorkersQuery.data?.find((w) => w.id === id);

  if (searchWorkersQuery.isLoading) {
    return (
      <div className={styles.centerLoading}>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className={`container ${styles.emptyMessage}`}>
        <h2>Worker profile not found</h2>
      </div>
    );
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.profileHeader}>
        <Avatar name={worker.user.name} src={worker.user.avatarUrl} size='xl' />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2xs)',
            flex: 1,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
          >
            <h1 className={styles.sectionTitle}>{worker.user.name}</h1>
            <Badge variant={worker.isAvailable ? 'success' : 'muted'}>
              {worker.isAvailable ? 'Available' : 'Busy'}
            </Badge>
          </div>
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--color-primary-600)',
            }}
          >
            {worker.category}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            <MapPin size={12} />
            <span>
              Base City: {worker.user.city} | Services: {worker.serviceCities.join(', ')}
            </span>
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              marginTop: 'var(--spacing-xs)',
            }}
          >
            <RatingStars rating={parseFloat(worker.avgRating)} showValue />
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              ({worker.totalReviews} verified reviews)
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
            {formatCurrency(worker.baseRate)}
          </span>
          <span
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
          >
            Rate Type: {worker.rateType}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <h3>About & Experience</h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-slate-700)' }}>
          {worker.bio || 'No detailed bio provided.'}
        </p>

        <h3 style={{ marginTop: 'var(--spacing-md)' }}>Verified Customer Reviews</h3>
        {reviewsQuery.isLoading ? (
          <Spinner />
        ) : (
          <ReviewList reviews={reviewsQuery.data || []} />
        )}
      </div>
    </div>
  );
};
