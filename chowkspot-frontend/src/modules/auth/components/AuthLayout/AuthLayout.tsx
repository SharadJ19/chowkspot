// FILE: src/modules/auth/components/AuthLayout/AuthLayout.tsx
import React from 'react';
import { Zap, ShieldCheck, Heart, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { WORKER_IMAGES } from '@/assets/images/workers';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className={styles.authContainer}>
      {/* LEFT: Custom Luxury Branded Gradient Showcase Hero */}
      <div className={styles.heroCanvas}>
        <div className={styles.brandHeader}>
          <span className={styles.tagline}>ChowkSpot Verified Marketplace</span>
          <h2 className={styles.brandHeading}>
            Direct &amp; Zero-Commission Local Expertise
          </h2>
        </div>

        {/* Frosted Glass Portrait Plumber Hero Card */}
        <div className={styles.featuredWorkerCard}>
          <div className={styles.cardImageWrapper}>
            <img
              src={WORKER_IMAGES.ashokChitkara}
              alt='Ashok Chitkara - Master Plumber'
              className={styles.workerHeroImg}
            />
            <div className={styles.verifiedPill}>
              <CheckCircle2 size={13} />
              <span>Verified Pro</span>
            </div>
            <div className={styles.imageBottomGradient} />
          </div>

          <div className={styles.cardBody}>
            <div className={styles.workerInfoRow}>
              <div>
                <h4 className={styles.workerName}>Ashok Chitkara</h4>
                <span className={styles.workerTrade}>
                  <Zap size={13} /> Master Plumber • Chandigarh Hub
                </span>
              </div>
              <div className={styles.ratingBadge}>
                <Star size={12} fill='currentColor' />
                <span>4.9</span>
              </div>
            </div>

            <p className={styles.quote}>
              &ldquo;Customers connect with me directly on ChowkSpot, and I keep 100% of
              my earnings with zero middleman commissions.&rdquo;
            </p>

            <div className={styles.locationFooter}>
              <MapPin size={12} />
              <span>Serving clients across Chandigarh, Mohali & Panchkula</span>
            </div>
          </div>
        </div>

        {/* Unique Glowing Perks List */}
        <div className={styles.perksList}>
          <div className={styles.perkItem}>
            <Zap size={16} className={styles.perkIcon} />
            <span>0% Platform Commission — Direct UPI Pay</span>
          </div>
          <div className={styles.perkItem}>
            <ShieldCheck size={16} className={styles.perkIcon} />
            <span>Verified Customer Reviews &amp; Ratings</span>
          </div>
          <div className={styles.perkItem}>
            <Heart size={16} className={styles.perkIcon} />
            <span>Empowering Independent Local Pros</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Perfectly Centered Responsive Form */}
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>{title}</h2>
            <p className={styles.formSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.formWrapper}>{children}</div>
        </div>
      </div>
    </div>
  );
};
