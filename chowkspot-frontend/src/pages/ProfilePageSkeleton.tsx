import React from 'react';
import styles from './ProfilePage.module.css';

export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div
      className={`container ${styles.profileContainer}`}
      aria-busy='true'
      aria-label='Loading profile'
    >
      <div className={styles.profileForm}>
        {/* Header Skeleton */}
        <div className={styles.formHeaderRow}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '60%' }}
          >
            <div
              style={{
                width: '180px',
                height: '24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-slate-200)',
              }}
            />
            <div
              style={{
                width: '260px',
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-slate-100)',
              }}
            />
          </div>
          <div
            style={{
              width: '90px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-slate-200)',
            }}
          />
        </div>

        {/* Avatar Uploader Skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-bg-app)',
            border: '1px dashed var(--color-border-strong)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-slate-200)',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div
              style={{
                width: '120px',
                height: '16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-slate-200)',
              }}
            />
            <div
              style={{
                width: '80%',
                height: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-slate-100)',
              }}
            />
          </div>
        </div>

        {/* Form Inputs Skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`input-skel-${index}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div
              style={{
                width: '100px',
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-slate-200)',
              }}
            />
            <div
              style={{
                width: '100%',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-slate-100)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>
        ))}

        {/* Submit Button Skeleton */}
        <div
          style={{
            width: '100%',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-slate-200)',
            marginTop: 'var(--spacing-xs)',
          }}
        />
      </div>

      {/* Account Actions Card Skeleton */}
      <div
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              width: '140px',
              height: '16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-slate-200)',
            }}
          />
          <div
            style={{
              width: '220px',
              height: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-slate-100)',
            }}
          />
        </div>
        <div
          style={{
            width: '100px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-slate-200)',
          }}
        />
      </div>
    </div>
  );
};
