// FILE: src/pages/WorkerDetailPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { MapPin, Calendar, Briefcase, ShieldCheck } from 'lucide-react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { BookingRequestModal } from '@/modules/bookings/components/BookingRequestModal/BookingRequestModal';
import type { WorkerSearchResult } from '@/types';
import { ReviewList } from '@/modules/reviews/components/ReviewList/ReviewList';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './WorkerDetailPage.module.css';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { searchWorkersQuery } = useWorkerQueries();
  const { reviewsQuery } = useReviewQueries(id);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const worker = searchWorkersQuery.data?.workers.find(
    (w: WorkerSearchResult) => w.id === id,
  );

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
    <div className={`container ${styles.detailContainer}`}>
      {/* Streamlined Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileMainInfo}>
          <Avatar name={worker.user.name} src={worker.user.avatarUrl} size='xl' />
          <div className={styles.textGroup}>
            <div className={styles.nameRow}>
              <h1 className={styles.workerName}>{worker.user.name}</h1>
              <Badge variant={worker.isAvailable ? 'success' : 'muted'}>
                {worker.isAvailable ? 'Available' : 'Busy'}
              </Badge>
            </div>
            <span className={styles.categoryText}>{worker.category}</span>

            {/* Service Hub Badges */}
            <div className={styles.citiesList}>
              <MapPin
                size={13}
                style={{ color: 'var(--color-primary-600)', flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Base: {worker.user.city} • Serves:
              </span>
              {worker.serviceCities.map((city: string) => (
                <span key={city} className={styles.cityBadge}>
                  {city}
                </span>
              ))}
            </div>

            <div className={styles.ratingRow}>
              <RatingStars rating={parseFloat(worker.avgRating)} showValue />
              <span className={styles.reviewCount}>({worker.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className={styles.rateActionWrapper}>
          <div className={styles.rateDisplay}>
            <span className={styles.rateAmount}>{formatCurrency(worker.baseRate)}</span>
            <span className={styles.rateTypeLabel}>
              per {worker.rateType.toLowerCase()}
            </span>
          </div>
          <Button
            variant='primary'
            size='sm'
            onClick={() => setIsBookingModalOpen(true)}
            disabled={!worker.isAvailable}
          >
            <Calendar size={14} />
            <span>Book Provider</span>
          </Button>
        </div>
      </div>

      {/* About & Experience Section */}
      <div className={styles.contentSection}>
        <h3 className={styles.sectionHeading}>About &amp; Experience</h3>
        <p className={styles.bioText}>
          {worker.bio ||
            'Experienced professional available for direct hire with zero platform commission.'}
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-lg)',
            marginTop: 'var(--spacing-2xs)',
          }}
        >
          <span
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
          >
            <Briefcase size={13} style={{ display: 'inline', marginRight: 4 }} />
            Experience: {worker.experienceYears} Years
          </span>
          <span
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
          >
            <ShieldCheck size={13} style={{ display: 'inline', marginRight: 4 }} />
            Verified Direct P2P Settlement
          </span>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className={styles.contentSection}>
        <h3 className={styles.sectionHeading}>Verified Customer Reviews</h3>
        {reviewsQuery.isLoading ? (
          <Spinner />
        ) : (
          <ReviewList reviews={reviewsQuery.data || []} />
        )}
      </div>

      {/* Shared Booking Request Modal */}
      <BookingRequestModal
        worker={worker}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};
