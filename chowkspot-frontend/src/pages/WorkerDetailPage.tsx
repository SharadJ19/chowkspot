// FILE: src/pages/WorkerDetailPage.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router';
import { MapPin, Calendar, Briefcase, ShieldCheck } from 'lucide-react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import type { WorkerSearchResult } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { ReviewList } from '@/modules/reviews/components/ReviewList/ReviewList';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './WorkerDetailPage.module.css';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { searchWorkersQuery } = useWorkerQueries();
  const { reviewsQuery } = useReviewQueries(id);
  const { createBookingMutation } = useBookingQueries();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [requestedDate, setRequestedDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const worker = searchWorkersQuery.data?.workers.find(
    (w: WorkerSearchResult) => w.id === id,
  );

  const handleBookSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!worker) return;
    setBookingError(null);

    try {
      const formattedIsoDate = new Date(requestedDate).toISOString();
      await createBookingMutation.mutateAsync({
        workerId: worker.id,
        requestedDate: formattedIsoDate,
        address,
        notes,
      });

      setIsBookingModalOpen(false);
      setRequestedDate('');
      setAddress('');
      setNotes('');
    } catch (err) {
      setBookingError((err as Error).message || 'Failed to submit booking request');
    }
  };

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
      {/* Refactored Streamlined Profile Card */}
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

            {/* Styled Service Hub Badges */}
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

      {/* Booking Request Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Book ${worker.user.name} (${worker.category})`}
      >
        {!isAuthenticated ? (
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              textAlign: 'center',
              padding: 'var(--spacing-md)',
            }}
          >
            Please log in to submit a direct booking request.
          </p>
        ) : (
          <form
            onSubmit={handleBookSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
          >
            {bookingError && (
              <div
                style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)' }}
              >
                {bookingError}
              </div>
            )}

            <Input
              label='Requested Date &amp; Time'
              type='datetime-local'
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />

            <Input
              label='Service Address'
              placeholder='House #, Street, Locality'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2xs)',
              }}
            >
              <label
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  color: 'var(--color-slate-700)',
                }}
              >
                Task Notes / Description
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Describe the repair or installation requirements...'
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-strong)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </div>

            <Button type='submit' isLoading={createBookingMutation.isPending} fullWidth>
              Send Direct Booking Request
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
