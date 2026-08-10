// FILE: src/modules/auth/components/AuthLayout/AuthLayout.tsx
import React from 'react';
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
      {/* LEFT: Solid Deep Emerald Hero */}
      <div className={styles.heroCanvas}>
        <div className={styles.brandHeader}>
          <span className={styles.tagline}>ChowkSpot Verified Marketplace</span>
          <h2 className={styles.brandHeading}>
            Direct &amp; Zero-Commission Local Expertise
          </h2>
          <p className={styles.brandDesc}>
            Connecting residents directly with verified neighborhood professionals across
            Himachal and Tricity with 0% platform cuts.
          </p>
        </div>

        {/* Solid Quote Box */}
        <div className={styles.quoteCard}>
          <p className={styles.quoteText}>
            &ldquo;Clients contact me directly, and I keep 100% of my service earnings
            with zero middleman fees or escrow holds.&rdquo;
          </p>
          <div className={styles.quoteAuthorRow}>
            <img
              src={WORKER_IMAGES.ashokChitkara}
              alt='Ashok Chitkara'
              className={styles.authorAvatar}
            />
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>Ashok Chitkara</span>
              <span className={styles.authorRole}>Master Plumber • Chandigarh Hub</span>
            </div>
          </div>
        </div>

        {/* Trust Metrics Footer */}
        <div className={styles.trustFooter}>
          <div className={styles.trustMetric}>
            <strong>0%</strong>
            <span>Commission Fee</span>
          </div>
          <div className={styles.trustMetric}>
            <strong>85+</strong>
            <span>Active Cities</span>
          </div>
          <div className={styles.trustMetric}>
            <strong>100%</strong>
            <span>Direct P2P UPI</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Compact Form Container */}
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
