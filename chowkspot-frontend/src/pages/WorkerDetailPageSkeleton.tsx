import React from 'react';
import styles from './WorkerDetailPage.module.css';
import skeletonStyles from '@/modules/workers/components/WorkerCard/WorkerCardSkeleton.module.css';

export const WorkerDetailPageSkeleton: React.FC = () => {
  return (
    <div
      className={`container ${styles.detailContainer}`}
      aria-busy='true'
      aria-label='Loading worker profile'
    >
      {/* 1. Hero Profile Card Skeleton */}
      <div className={styles.profileCard}>
        <div className={styles.profileMainInfo}>
          {/* Avatar Skeleton (XL) */}
          <div
            className={skeletonStyles.shimmer}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: 'var(--radius-full)',
              flexShrink: 0,
            }}
          />

          {/* Name & Metadata Lines */}
          <div className={styles.textGroup} style={{ width: '100%', minWidth: '220px' }}>
            <div className={styles.nameRow} style={{ gap: '10px' }}>
              <div
                className={skeletonStyles.shimmer}
                style={{
                  width: '180px',
                  height: '26px',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <div
                className={skeletonStyles.shimmer}
                style={{
                  width: '75px',
                  height: '22px',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>

            <div
              className={skeletonStyles.shimmer}
              style={{
                width: '120px',
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '4px',
              }}
            />

            {/* City Badges row */}
            <div className={styles.citiesList} style={{ gap: '6px', marginTop: '6px' }}>
              <div
                className={skeletonStyles.shimmer}
                style={{
                  width: '60px',
                  height: '18px',
                  borderRadius: 'var(--radius-full)',
                }}
              />
              <div
                className={skeletonStyles.shimmer}
                style={{
                  width: '70px',
                  height: '18px',
                  borderRadius: 'var(--radius-full)',
                }}
              />
              <div
                className={skeletonStyles.shimmer}
                style={{
                  width: '65px',
                  height: '18px',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>

            {/* Rating Stars row */}
            <div
              className={skeletonStyles.shimmer}
              style={{
                width: '140px',
                height: '16px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '6px',
              }}
            />
          </div>
        </div>

        {/* Rate & Book Button Skeleton */}
        <div className={styles.rateActionWrapper}>
          <div className={styles.rateDisplay} style={{ gap: '4px' }}>
            <div
              className={skeletonStyles.shimmer}
              style={{ width: '100px', height: '24px', borderRadius: 'var(--radius-sm)' }}
            />
            <div
              className={skeletonStyles.shimmer}
              style={{ width: '60px', height: '12px', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '130px', height: '36px', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      </div>

      {/* 2. About & Experience Block Skeleton */}
      <div className={styles.contentSection}>
        <div
          className={skeletonStyles.shimmer}
          style={{ width: '160px', height: '18px', borderRadius: 'var(--radius-sm)' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '4px 0',
          }}
        >
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '100%', height: '14px', borderRadius: 'var(--radius-sm)' }}
          />
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '92%', height: '14px', borderRadius: 'var(--radius-sm)' }}
          />
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '78%', height: '14px', borderRadius: 'var(--radius-sm)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginTop: '4px' }}>
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '130px', height: '14px', borderRadius: 'var(--radius-sm)' }}
          />
          <div
            className={skeletonStyles.shimmer}
            style={{ width: '180px', height: '14px', borderRadius: 'var(--radius-sm)' }}
          />
        </div>
      </div>

      {/* 3. Customer Reviews Section Skeleton */}
      <div className={styles.contentSection}>
        <div
          className={skeletonStyles.shimmer}
          style={{ width: '180px', height: '18px', borderRadius: 'var(--radius-sm)' }}
        />

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
        >
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={`review-skel-${idx}`}
              style={{
                padding: 'var(--spacing-sm)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className={skeletonStyles.shimmer}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: 'var(--radius-full)',
                    flexShrink: 0,
                  }}
                />
                <div
                  className={skeletonStyles.shimmer}
                  style={{
                    width: '110px',
                    height: '14px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <div
                  className={skeletonStyles.shimmer}
                  style={{
                    width: '80px',
                    height: '14px',
                    borderRadius: 'var(--radius-sm)',
                    marginLeft: 'auto',
                  }}
                />
              </div>
              <div
                className={skeletonStyles.shimmer}
                style={{ width: '95%', height: '12px', borderRadius: 'var(--radius-sm)' }}
              />
              <div
                className={skeletonStyles.shimmer}
                style={{ width: '70%', height: '12px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
