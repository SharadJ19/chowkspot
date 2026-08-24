import React from 'react';
import { WorkerCardSkeleton } from '@/modules/workers/components/WorkerCard/WorkerCardSkeleton';
import { WorkerSidebarFiltersSkeleton } from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFiltersSkeleton';
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
        {/* Sidebar filter skeleton */}
        <WorkerSidebarFiltersSkeleton />

        {/* Worker Cards Grid Skeleton */}
        <div className='grid-auto-fit'>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <WorkerCardSkeleton key={`route-skeleton-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
