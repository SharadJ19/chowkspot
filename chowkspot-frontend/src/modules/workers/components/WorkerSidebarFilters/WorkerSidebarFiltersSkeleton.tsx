import React from 'react';
import styles from './WorkerSidebarFiltersSkeleton.module.css';

export const WorkerSidebarFiltersSkeleton: React.FC = () => {
  return (
    <aside
      className={styles.sidebarSkeleton}
      aria-busy='true'
      aria-label='Loading search filters'
    >
      {/* Header Skeleton */}
      <div className={styles.headerRow}>
        <div className={`${styles.titleSkel} ${styles.shimmer}`} />
        <div className={`${styles.btnSkel} ${styles.shimmer}`} />
      </div>

      {/* 1. Search Name Skeleton */}
      <div className={styles.section}>
        <div className={`${styles.labelSkel} ${styles.shimmer}`} />
        <div className={`${styles.inputSkel} ${styles.shimmer}`} />
      </div>

      {/* 2. Experience Slider Skeleton */}
      <div className={styles.section}>
        <div
          className={`${styles.labelSkel} ${styles.shimmer}`}
          style={{ width: '150px' }}
        />
        <div className={`${styles.sliderSkel} ${styles.shimmer}`} />
        <div className={styles.sliderLabelsRow}>
          <div className={`${styles.sliderLabelSkel} ${styles.shimmer}`} />
          <div className={`${styles.sliderLabelSkel} ${styles.shimmer}`} />
        </div>
      </div>

      {/* 3. Max Price Slider Skeleton */}
      <div className={styles.section}>
        <div
          className={`${styles.labelSkel} ${styles.shimmer}`}
          style={{ width: '130px' }}
        />
        <div className={`${styles.sliderSkel} ${styles.shimmer}`} />
        <div className={styles.sliderLabelsRow}>
          <div className={`${styles.sliderLabelSkel} ${styles.shimmer}`} />
          <div className={`${styles.sliderLabelSkel} ${styles.shimmer}`} />
        </div>
      </div>

      {/* 4. Availability Checkbox Skeleton */}
      <div className={styles.checkboxRow}>
        <div className={`${styles.checkboxSkel} ${styles.shimmer}`} />
        <div className={`${styles.checkboxTextSkel} ${styles.shimmer}`} />
      </div>

      {/* 5. Trade Category Select Skeleton */}
      <div className={styles.section}>
        <div className={`${styles.labelSkel} ${styles.shimmer}`} />
        <div className={`${styles.inputSkel} ${styles.shimmer}`} />
      </div>

      {/* 6. City Select Skeleton */}
      <div className={styles.section}>
        <div className={`${styles.labelSkel} ${styles.shimmer}`} />
        <div className={`${styles.inputSkel} ${styles.shimmer}`} />
      </div>

      {/* Footer Info Skeleton */}
      <div
        style={{
          paddingTop: '8px',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <div className={`${styles.footerSkel} ${styles.shimmer}`} />
      </div>
    </aside>
  );
};
