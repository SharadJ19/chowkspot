import React from 'react';
import styles from './AdminDashboardSkeleton.module.css';

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div
      className={styles.adminContainer}
      aria-busy='true'
      aria-label='Loading admin portal'
    >
      {/* Header */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className={styles.shimmer} style={{ width: '220px', height: '28px' }} />
          <div className={styles.shimmer} style={{ width: '280px', height: '14px' }} />
        </div>
        <div
          className={styles.shimmer}
          style={{ width: '130px', height: '24px', borderRadius: 'var(--radius-full)' }}
        />
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`stat-skel-${idx}`} className={styles.statCardSkel}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                className={styles.shimmer}
                style={{ width: '100px', height: '14px' }}
              />
              <div
                className={styles.shimmer}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-xl)',
                }}
              />
            </div>
            <div className={styles.shimmer} style={{ width: '70px', height: '32px' }} />
            <div className={styles.shimmer} style={{ width: '110px', height: '12px' }} />
          </div>
        ))}
      </div>

      {/* Table Panel */}
      <div className={styles.tablePanelSkel}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
          }}
        >
          <div className={styles.shimmer} style={{ width: '160px', height: '20px' }} />
          <div
            className={styles.shimmer}
            style={{ width: '240px', height: '38px', borderRadius: 'var(--radius-md)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div
            className={styles.shimmer}
            style={{ width: '70px', height: '30px', borderRadius: 'var(--radius-md)' }}
          />
          <div
            className={styles.shimmer}
            style={{ width: '70px', height: '30px', borderRadius: 'var(--radius-md)' }}
          />
          <div
            className={styles.shimmer}
            style={{ width: '70px', height: '30px', borderRadius: 'var(--radius-md)' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`row-skel-${idx}`}
              className={styles.shimmer}
              style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
