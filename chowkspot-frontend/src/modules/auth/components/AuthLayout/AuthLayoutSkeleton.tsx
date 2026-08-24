import React from 'react';
import styles from './AuthLayoutSkeleton.module.css';

export const AuthLayoutSkeleton: React.FC = () => {
  return (
    <div
      className={styles.authContainer}
      aria-busy='true'
      aria-label='Loading authentication'
    >
      <div className={styles.heroCanvas}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            className={styles.heroShimmer}
            style={{ width: '120px', height: '14px' }}
          />
          <div className={styles.heroShimmer} style={{ width: '85%', height: '28px' }} />
          <div className={styles.heroShimmer} style={{ width: '70%', height: '14px' }} />
        </div>

        <div
          style={{
            padding: 'var(--spacing-md)',
            background: 'rgba(15, 23, 42, 0.35)',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div className={styles.heroShimmer} style={{ width: '100%', height: '14px' }} />
          <div className={styles.heroShimmer} style={{ width: '70%', height: '14px' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '6px',
            }}
          >
            <div
              className={styles.heroShimmer}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-full)',
              }}
            />
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}
            >
              <div
                className={styles.heroShimmer}
                style={{ width: '110px', height: '14px' }}
              />
              <div
                className={styles.heroShimmer}
                style={{ width: '140px', height: '12px' }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '12px',
          }}
        >
          <div className={styles.heroShimmer} style={{ width: '60px', height: '24px' }} />
          <div className={styles.heroShimmer} style={{ width: '60px', height: '24px' }} />
          <div className={styles.heroShimmer} style={{ width: '60px', height: '24px' }} />
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              className={`${styles.shimmer}`}
              style={{ width: '160px', height: '24px' }}
            />
            <div
              className={`${styles.shimmer}`}
              style={{ width: '220px', height: '14px' }}
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
              style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-md)' }}
            />
            <div
              className={`${styles.shimmer}`}
              style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-md)' }}
            />
            <div
              className={`${styles.shimmer}`}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                marginTop: '6px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
