import React from 'react';
import { WorkerCardSkeleton } from '@/modules/workers/components/WorkerCard/WorkerCardSkeleton';
import styles from './SearchPage.module.css';

const SKELETON_COUNT = 6;

export const SearchPageSkeleton: React.FC = () => {
  return (
    <div
      className={`container ${styles.pageContainer}`}
      aria-busy='true'
      aria-label='Loading marketplace'
    >
      <div>
        <h1 className={styles.sectionTitle}>Worker Marketplace</h1>
        <p className={styles.sectionSubtitle}>
          Discover and book verified local service professionals across regional hubs
        </p>
      </div>

      <div className={styles.searchLayoutGrid}>
        {/* Skeleton for desktop filter sidebar */}
        <div
          style={{
            width: '300px',
            minWidth: '300px',
            height: '520px',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xs)',
          }}
        />

        {/* Shimmer Worker Cards Grid */}
        <div className='grid-auto-fit'>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <WorkerCardSkeleton key={`route-skeleton-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
