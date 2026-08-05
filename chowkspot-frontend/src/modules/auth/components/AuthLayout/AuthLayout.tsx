import React from 'react';
import { ShieldCheck, Zap, Heart, Star, MapPin, CheckCircle } from 'lucide-react';
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
      {/* LEFT: Branding Hero Canvas */}
      <div className={styles.heroCanvas}>
        <div className={styles.brandHeader}>
          <span className={styles.tagline}>
            Himachal Pradesh & Tricity’s Zero-Commission Marketplace
          </span>
        </div>

        {/* Dynamic Highlight Card */}
        <div className={styles.highlightCard}>
          <div className={styles.cardBadge}>
            <CheckCircle size={14} />
            <span>Verified Pro Highlight</span>
          </div>

          <div className={styles.cardHeader}>
            <img
              src={WORKER_IMAGES.safalVaradhan}
              alt='Safal Varadhan - Skilled Electrician'
              className={styles.avatarImg}
            />
            <div>
              <h4 className={styles.workerName}>Safal Varadhan</h4>
              <span className={styles.workerRole}>Master Electrician</span>
              <div className={styles.workerMeta}>
                <span className={styles.location}>
                  <MapPin size={12} /> Mohali
                </span>
                <span className={styles.rating}>
                  <Star size={12} fill='currentColor' /> 4.9 (52 reviews)
                </span>
              </div>
            </div>
          </div>

          <p className={styles.quote}>
            "ChowkSpot changed how I work. Customers call me directly, we schedule
            instantly, and I get paid 100% via UPI without losing commission to
            middlemen."
          </p>
        </div>

        {/* Platform Perks List */}
        <div className={styles.perksList}>
          <div className={styles.perkItem}>
            <div className={styles.perkIcon}>
              <Zap size={18} />
            </div>
            <div>
              <h5>0% Platform Commission</h5>
              <p>100% direct settlement via peer-to-peer UPI or cash.</p>
            </div>
          </div>

          <div className={styles.perkItem}>
            <div className={styles.perkIcon}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h5>Verified Reviews</h5>
              <p>Authentic feedback posted only after completed booking records.</p>
            </div>
          </div>

          <div className={styles.perkItem}>
            <div className={styles.perkIcon}>
              <Heart size={18} />
            </div>
            <div>
              <h5>Empowering Local Trades</h5>
              <p>
                Directly supporting independent skilled tradespeople across 12+ regional
                cities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Interactive Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{title}</h2>
          <p className={styles.formSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.formWrapper}>{children}</div>
      </div>
    </div>
  );
};
