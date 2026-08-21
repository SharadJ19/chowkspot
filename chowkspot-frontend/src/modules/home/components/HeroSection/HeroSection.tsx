import React from 'react';
import { useNavigate } from 'react-router';
import { Search, UserPlus, Sparkle, CheckCircle, Zap, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { WORKER_IMAGES } from '@/assets/images/workers';
import styles from './HeroSection.module.css';

const FEATURED_WORKER = {
  name: 'Safal Varadhan',
  trade: 'Master Electrician',
  city: 'Mohali',
  rate: '₹400/hr',
  rating: '4.9',
  reviews: 52,
  image: WORKER_IMAGES.safalVaradhan,
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className={`container ${styles.heroSection}`}>
      <div className={styles.heroContent}>
        <div className={styles.badgePill}>
          <Sparkle size={14} className={styles.sparkleIcon} />
          <span>Zero Platform Commissions • 100% Direct P2P Settlement</span>
        </div>
        <h1 className={styles.heroTitle}>
          Direct Access to Verified Local{' '}
          <span className={styles.highlightText}>Skilled Workers</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Find trusted electricians, plumbers, carpenters, and technicians across Himachal
          &amp; Tricity with transparent rates and zero intermediary fees.
        </p>
        <div className={styles.heroActions}>
          <Button size='lg' onClick={() => navigate('/search')}>
            <Search size={18} />
            <span>Find Workers Now</span>
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => navigate('/register?role=WORKER')}
          >
            <UserPlus size={18} />
            <span>Join as a Worker</span>
          </Button>
        </div>
      </div>

      <div className={styles.heroVisualShowcase}>
        <div className={styles.showcaseGlow} />
        <div className={styles.heroCard}>
          <div className={styles.heroImgWrapper}>
            <img
              src={FEATURED_WORKER.image}
              alt={`${FEATURED_WORKER.name} - ${FEATURED_WORKER.trade}`}
              className={styles.heroImg}
              loading='eager'
              fetchPriority='high'
            />
            <span className={styles.verifiedBadge}>
              <CheckCircle size={13} /> Verified Pro
            </span>
          </div>
          <div className={styles.heroCardBody}>
            <div className={styles.heroCardHeader}>
              <div>
                <h3 className={styles.workerName}>{FEATURED_WORKER.name}</h3>
                <span className={styles.workerTrade}>
                  <Zap size={14} /> {FEATURED_WORKER.trade}
                </span>
              </div>
              <span className={styles.workerRate}>{FEATURED_WORKER.rate}</span>
            </div>
            <div className={styles.heroCardMeta}>
              <span className={styles.metaLocation}>
                <MapPin size={13} /> {FEATURED_WORKER.city}
              </span>
              <span className={styles.metaRating}>
                <Star size={13} fill='currentColor' /> {FEATURED_WORKER.rating} (
                {FEATURED_WORKER.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
