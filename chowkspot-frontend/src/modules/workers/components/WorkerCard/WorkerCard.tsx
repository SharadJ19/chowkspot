import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar, LogIn, ShieldAlert, Wrench } from 'lucide-react';
import type { WorkerSearchResult } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './WorkerCard.module.css';

export interface WorkerCardProps {
  worker: WorkerSearchResult;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isWorker = user?.role === 'WORKER';

  const handleBookClick = () => {
    if (!isAuthenticated || !user || isAdmin || isWorker) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate(`/worker/${worker.id}/book`);
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

  return (
    <>
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
              onClick={handleBookClick}
              disabled={!worker.isAvailable}
            >
              <Calendar size={13} />
              <span>Book</span>
            </Button>
          </div>
        </div>
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
    </>
  );
};
