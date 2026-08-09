import React from 'react';
import {
  Search,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import styles from '@/pages/Pages.module.css';

export const HowItWorks: React.FC = () => {
  return (
    <section className={styles.howItWorksSection}>
      <div className={`container ${styles.sectionBlock}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How ChowkSpot Works</h2>
          <p className={styles.sectionSubtitle}>
            Three simple steps to discover, hire, and settle with local skilled workers
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumberBadge}>01</div>
            <div className={styles.stepIconWrapper}>
              <Search size={22} />
            </div>
            <h3 className={styles.stepTitle}>Discover Providers</h3>
            <p className={styles.stepDescription}>
              Filter workers by specific trade category, regional city coverage, and
              real-time availability status.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumberBadge}>02</div>
            <div className={styles.stepIconWrapper}>
              <CalendarCheck size={22} />
            </div>
            <h3 className={styles.stepTitle}>Direct Booking Request</h3>
            <p className={styles.stepDescription}>
              Submit request times with work notes. Workers can accept, reject, or propose
              alternative slot counter-offers.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumberBadge}>03</div>
            <div className={styles.stepIconWrapper}>
              <CreditCard size={22} />
            </div>
            <h3 className={styles.stepTitle}>Fee-Free Direct UPI Pay</h3>
            <p className={styles.stepDescription}>
              Settle payments directly to the worker via deep-linked UPI or scannable QR
              codes with zero platform deductions.
            </p>
          </div>
        </div>

        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <ShieldCheck size={24} className={styles.valueIcon} />
            <div>
              <h3 className={styles.valueTitle}>100% Direct P2P Settlement</h3>
              <p className={styles.valueDesc}>
                Zero escrow holds or platform cuts. Payments transfer straight to the
                worker.
              </p>
            </div>
          </div>

          <div className={styles.valueCard}>
            <Clock size={24} className={styles.valueIcon} />
            <div>
              <h3 className={styles.valueTitle}>Real-time Socket Updates</h3>
              <p className={styles.valueDesc}>
                Instant live notifications when workers accept, counter-offer, or complete
                jobs.
              </p>
            </div>
          </div>

          <div className={styles.valueCard}>
            <CheckCircle2 size={24} className={styles.valueIcon} />
            <div>
              <h3 className={styles.valueTitle}>Verified Customer Reviews</h3>
              <p className={styles.valueDesc}>
                Ratings can only be posted for completed booking records, guaranteeing
                real feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
