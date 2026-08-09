// FILE: src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { WorkerCard } from '@/modules/workers/components/WorkerCard/WorkerCard';
import { WorkerSidebarFilters } from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button/Button';
import { BookingRequestModal } from '@/components/BookingRequestModal/BookingRequestModal';
import type { WorkerSearchResult } from '@/types';
import styles from './Pages.module.css';
import sidebarStyles from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters.module.css';

export const SearchPage: React.FC = () => {
  const { filters, setFilter, setPage, resetFilters } = useSearchFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Count active filters for badge
  const activeFiltersCount = [
    filters.name,
    filters.category,
    filters.city,
    filters.availableOnly,
    filters.minExperience,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div>
        <h1 className={styles.sectionTitle}>Worker Marketplace</h1>
        <p className={styles.sectionSubtitle}>
          Discover and book verified local service professionals across regional hubs
        </p>
      </div>

      {/* Mobile Sticky Filter Bar Button (< 960px) */}
      <div className={sidebarStyles.mobileFilterTriggerBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--color-primary-600)' }} />
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
            Filters {activeFiltersCount > 0 ? `(${activeFiltersCount} Active)` : ''}
          </span>
        </div>
        <Button size='sm' variant='outline' onClick={() => setIsMobileFilterOpen(true)}>
          Open Filters
        </Button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileFilterOpen && (
        <div
          className={sidebarStyles.mobileBackdrop}
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'start',
        }}
        className='searchLayoutGrid'
      >
        {/* Sidebar / Bottom Sheet Drawer */}
        <div
          style={
            isMobileFilterOpen
              ? { display: 'block' }
              : { display: undefined } /* Controlled via CSS media queries for desktop */
          }
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
            onMinExperienceChange={(val) =>
              setFilter('minExp', val > 0 ? val : undefined)
            }
            onMaxPriceChange={(val) =>
              setFilter('maxPrice', val < 3000 ? val : undefined)
            }
            onReset={() => {
              resetFilters();
              setIsMobileFilterOpen(false);
            }}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
            totalResults={pagination.total}
          />

          {/* Close button shown only inside mobile sheet drawer */}
          {isMobileFilterOpen && (
            <div
              style={{
                position: 'fixed',
                top: '12px',
                right: '12px',
                zIndex: 2000,
                display: 'none', // handled inside CSS if needed, or inline toggle
              }}
            >
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X size={16} /> Close
              </Button>
            </div>
          )}
        </div>

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
