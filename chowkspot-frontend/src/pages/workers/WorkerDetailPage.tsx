import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  LogIn,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSingleWorkerQuery } from '@/modules/workers/hooks/useWorkerQueries';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { ReviewList } from '@/modules/reviews/components/ReviewList/ReviewList';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { formatCurrency } from '@/utils/formatCurrency';
import { WorkerDetailPageSkeleton } from './WorkerDetailPageSkeleton';
import skeletonStyles from '@/modules/workers/components/WorkerCard/WorkerCardSkeleton.module.css';
import styles from './WorkerDetailPage.module.css';

export const WorkerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { data: worker, isLoading } = useSingleWorkerQuery(id);
  const { reviewsQuery } = useReviewQueries(id);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const isWorker = user?.role === 'WORKER';

  const handleBookClick = () => {
    if (!isAuthenticated || !user || isAdmin || isWorker) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate(`/worker/${worker?.id}/book`);
  };

  const getModalDetails = () => {
    if (isAdmin) {
      return {
        icon: <ShieldAlert size={28} />,
        bgColor: '#fef3c7',
        color: '#d97706',
        title: 'Admin Restriction Notice',
        text: 'Administrators cannot book workers. Please sign in with a customer account.',
      };
    }
    if (isWorker) {
      return {
        icon: <Wrench size={28} />,
        bgColor: 'var(--color-primary-50)',
        color: 'var(--color-primary-600)',
        title: 'Worker Account Notice',
        text: 'Workers cannot book other providers. Please log in with a user account to book.',
      };
    }
    return {
      icon: <LogIn size={28} />,
      bgColor: 'var(--color-primary-50)',
      color: 'var(--color-primary-600)',
      title: 'Authentication Required',
      text: 'Please log in to your customer account to request a service appointment.',
    };
  };

  const details = getModalDetails();

  if (isLoading) {
    return <WorkerDetailPageSkeleton />;
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
            onClick={handleBookClick}
            disabled={!worker.isAvailable}
          >
            <Calendar size={14} />
            <span>Book Provider</span>
          </Button>
        </div>
      </div>

      <div className={styles.contentSection}>
        <h3 className={styles.sectionHeading}>About &amp; Experience</h3>
        <p className={styles.bioText}>{worker.bio}</p>
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

      <div className={styles.contentSection}>
        <h3 className={styles.sectionHeading}>Verified Customer Reviews</h3>
        {reviewsQuery.isLoading ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
          >
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={`inline-skel-${idx}`}
                style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    className={skeletonStyles.shimmer}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: 'var(--radius-full)',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    className={skeletonStyles.shimmer}
                    style={{
                      width: '110px',
                      height: '14px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                </div>
                <div
                  className={skeletonStyles.shimmer}
                  style={{
                    width: '90%',
                    height: '12px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <ReviewList reviews={reviewsQuery.data || []} />
        )}
      </div>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={details.title}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'center',
            padding: '0.50rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              backgroundColor: details.bgColor,
              color: details.color,
              borderRadius: '50%',
              margin: '0 auto',
            }}
          >
            {details.icon}
          </div>

          <p
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            {details.text}
          </p>
        </div>
      </Modal>
    </div>
  );
};
