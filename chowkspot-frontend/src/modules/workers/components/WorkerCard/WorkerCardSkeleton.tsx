import React from 'react';
import styles from './WorkerCardSkeleton.module.css';

export const WorkerCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeletonCard} aria-busy='true' aria-label='Loading provider'>
      <div>
        <div className={styles.header}>
          <div className={`${styles.avatarSkeleton} ${styles.shimmer}`} />
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <div className={`${styles.nameLine} ${styles.shimmer}`} />
              <div className={`${styles.badgeLine} ${styles.shimmer}`} />
            </div>
            <div className={`${styles.categoryLine} ${styles.shimmer}`} />
            <div className={styles.citiesLine}>
              <div className={`${styles.cityPill} ${styles.shimmer}`} />
              <div className={`${styles.cityPill} ${styles.shimmer}`} />
              <div className={`${styles.cityPill} ${styles.shimmer}`} />
            </div>
          </div>
        </div>

        <div className={styles.bioSection}>
          <div className={`${styles.bioLine1} ${styles.shimmer}`} />
          <div className={`${styles.bioLine2} ${styles.shimmer}`} />
        </div>

        <div className={`${styles.ratingLine} ${styles.shimmer}`} />
      </div>

      <div className={styles.footer}>
        <div className={`${styles.rateLine} ${styles.shimmer}`} />
        <div className={styles.actionGroup}>
          <div className={`${styles.btnSkeleton} ${styles.shimmer}`} />
          <div className={`${styles.btnSkeleton} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
};
