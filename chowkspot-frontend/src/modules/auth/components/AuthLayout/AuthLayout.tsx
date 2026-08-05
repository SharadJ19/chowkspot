import React from 'react';
import { Zap, ShieldCheck, Heart } from 'lucide-react';
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
      {/* LEFT: Clean & Lean Branding Hero */}
      <div className={styles.heroCanvas}>
        <div className={styles.brandHeader}>
          <span className={styles.tagline}>ChowkSpot Platform</span>
          <h3 className={styles.brandHeading}>
            Direct & Zero-Commission Skill Marketplace
          </h3>
        </div>

        {/* Compact Pro Highlight */}
        <div className={styles.highlightCard}>
          <div className={styles.cardHeader}>
            <img
              src={WORKER_IMAGES.safalVaradhan}
              alt='Safal Varadhan - Master Electrician'
              className={styles.avatarImg}
            />
            <div>
              <h4 className={styles.workerName}>Safal Varadhan</h4>
              <span className={styles.workerRole}>Master Electrician • Mohali</span>
            </div>
          </div>
          <p className={styles.quote}>
            "Customers connect with me directly on ChowkSpot, and I keep 100% of my
            earnings with zero middleman commissions."
          </p>
        </div>

        {/* Minimalist Perks List */}
        <div className={styles.perksList}>
          <div className={styles.perkItem}>
            <Zap size={16} className={styles.perkIcon} />
            <span>0% Platform Commission — Direct UPI Pay</span>
          </div>
          <div className={styles.perkItem}>
            <ShieldCheck size={16} className={styles.perkIcon} />
            <span>Verified Customer Reviews & Ratings</span>
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
