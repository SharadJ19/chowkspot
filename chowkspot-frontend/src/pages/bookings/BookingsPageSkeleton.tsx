import React from 'react';
import layoutStyles from './BookingsPage.module.css';
import styles from './BookingsPageSkeleton.module.css';

export const BookingsPageSkeleton: React.FC = () => {
  return (
    <div
      className={layoutStyles.consoleContainer}
      aria-busy='true'
      aria-label='Loading bookings workspace'
    >
      {/* 1. Header Bar Skeleton */}
      <div className={styles.headerSkeleton}>
        <div className={styles.headerLeft}>
          <div className={`${styles.headerIconSkel} ${styles.shimmer}`} />
          <div>
            <div className={`${styles.headerTitleSkel} ${styles.shimmer}`} />
            <div className={`${styles.headerSubSkel} ${styles.shimmer}`} />
          </div>
        </div>
        <div className={`${styles.headerBadgeSkel} ${styles.shimmer}`} />
      </div>

      {/* 2. Filter Tabs Skeleton */}
      <div className={styles.tabsSkeleton}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={`tab-skel-${idx}`}
            className={`${styles.tabPillSkel} ${styles.shimmer}`}
          />
        ))}
      </div>

      {/* 3. Split Layout Skeleton */}
      <div className={layoutStyles.splitLayout}>
        {/* Master Feed (Left) */}
        <div className={styles.masterPaneSkeleton}>
          <div className={`${styles.searchBarSkel} ${styles.shimmer}`} />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`feed-skel-${idx}`} className={styles.feedItemSkel}>
              <div className={styles.feedItemTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={`${styles.feedAvatarSkel} ${styles.shimmer}`} />
                  <div className={`${styles.feedNameSkel} ${styles.shimmer}`} />
                </div>
                <div className={`${styles.feedStatusBadgeSkel} ${styles.shimmer}`} />
              </div>
              <div className={styles.feedItemBottom}>
                <div className={`${styles.feedDateSkel} ${styles.shimmer}`} />
                <div className={`${styles.feedAddrSkel} ${styles.shimmer}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Detail Canvas (Right) */}
        <div className={styles.detailCanvasSkeleton}>
          <div className={styles.canvasHeaderSkel}>
            <div className={`${styles.canvasAvatarSkel} ${styles.shimmer}`} />
            <div>
              <div className={`${styles.canvasTitleSkel} ${styles.shimmer}`} />
              <div className={`${styles.canvasSubSkel} ${styles.shimmer}`} />
            </div>
          </div>

          <div className={`${styles.stepperBoxSkel} ${styles.shimmer}`} />

          <div className={styles.infoGridSkel}>
            <div className={`${styles.infoCardSkel} ${styles.shimmer}`} />
            <div className={`${styles.infoCardSkel} ${styles.shimmer}`} />
            <div className={`${styles.infoCardSkel} ${styles.shimmer}`} />
          </div>

          <div className={`${styles.notesCardSkel} ${styles.shimmer}`} />
          <div className={`${styles.settlementBannerSkel} ${styles.shimmer}`} />
          <div className={`${styles.reviewBoxSkel} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
};
