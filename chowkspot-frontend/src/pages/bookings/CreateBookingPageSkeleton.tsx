import React from 'react';
import styles from './CreateBookingPageSkeleton.module.css';

export const CreateBookingPageSkeleton: React.FC = () => {
  return (
    <div
      className={styles.pageWrapper}
      aria-busy='true'
      aria-label='Loading booking portal'
    >
      <div className={`${styles.shimmer}`} style={{ width: '160px', height: '16px' }} />

      <div className={styles.twoColumnLayout}>
        <div className={styles.formCardSkel}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              className={`${styles.shimmer}`}
              style={{ width: '240px', height: '22px' }}
            />
            <div
              className={`${styles.shimmer}`}
              style={{ width: '140px', height: '14px' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            <div
              className={`${styles.shimmer}`}
              style={{ width: '100%', height: '38px' }}
            />
            <div
              className={`${styles.shimmer}`}
              style={{ width: '100%', height: '120px' }}
            />
          </div>

          <div
            className={`${styles.shimmer}`}
            style={{ width: '100%', height: '42px', marginTop: 'auto' }}
          />
        </div>

        <aside className={styles.sidebarCardSkel}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div
              className={`${styles.shimmer}`}
              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            />
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}
            >
              <div
                className={`${styles.shimmer}`}
                style={{ width: '120px', height: '16px' }}
              />
              <div
                className={`${styles.shimmer}`}
                style={{ width: '80px', height: '12px' }}
              />
            </div>
          </div>
          <div
            className={`${styles.shimmer}`}
            style={{ width: '100%', height: '60px' }}
          />
          <div
            className={`${styles.shimmer}`}
            style={{ width: '100%', height: '36px', borderRadius: 'var(--radius-lg)' }}
          />
        </aside>
      </div>
    </div>
  );
};
