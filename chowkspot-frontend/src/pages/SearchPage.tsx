// FILE: src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { WorkerCard } from '@/modules/workers/components/WorkerCard/WorkerCard';
import { WorkerSidebarFilters } from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { BookingRequestModal } from '@/components/BookingRequestModal/BookingRequestModal';
import type { WorkerSearchResult } from '@/types';
import styles from './Pages.module.css';

export const SearchPage: React.FC = () => {
  const { filters, setFilter, setPage, resetFilters } = useSearchFilters();

  const { searchWorkersQuery } = useWorkerQueries({
    name: filters.name,
    category: filters.category,
    city: filters.city,
    availableOnly: filters.availableOnly,
    minExperience: filters.minExperience,
    maxPrice: filters.maxPrice,
    page: filters.page,
    limit: 12,
  });

  const [selectedWorker, setSelectedWorker] = useState<WorkerSearchResult | null>(null);

  const workers = searchWorkersQuery.data?.workers || [];
  const pagination = searchWorkersQuery.data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div>
        <h1 className={styles.sectionTitle}>Worker Marketplace</h1>
        <p className={styles.sectionSubtitle}>
          Discover and book verified local service professionals across regional hubs
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'start',
        }}
        className='searchLayoutGrid'
      >
        <WorkerSidebarFilters
          searchName={filters.name}
          selectedCategory={filters.category}
          selectedCity={filters.city}
          availableOnly={filters.availableOnly}
          minExperience={filters.minExperience || 0}
          maxPrice={filters.maxPrice || 3000}
          onSearchNameChange={(val) => setFilter('name', val)}
          onCategoryChange={(val) => setFilter('category', val)}
          onCityChange={(val) => setFilter('city', val)}
          onAvailableOnlyChange={(val) => setFilter('availableOnly', val)}
          onMinExperienceChange={(val) => setFilter('minExp', val > 0 ? val : undefined)}
          onMaxPriceChange={(val) => setFilter('maxPrice', val < 3000 ? val : undefined)}
          onReset={resetFilters}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalResults={pagination.total}
        />
        <div>
          {searchWorkersQuery.isLoading ? (
            <div className={styles.centerLoading}>
              <Spinner size='lg' />
            </div>
          ) : workers.length > 0 ? (
            <>
              <div className='grid-auto-fit'>
                {workers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onBookClick={(w) => setSelectedWorker(w)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className={styles.emptyMessage}>
              No service providers matched your search filters.
            </p>
          )}
        </div>
      </div>

      <BookingRequestModal
        worker={selectedWorker}
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
      />
    </div>
  );
};
