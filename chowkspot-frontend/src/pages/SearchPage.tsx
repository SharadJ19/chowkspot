import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { WorkerCard } from '@/modules/workers/components/WorkerCard/WorkerCard';
import { WorkerCardSkeleton } from '@/modules/workers/components/WorkerCard/WorkerCardSkeleton';
import { WorkerSidebarFilters } from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Button } from '@/components/ui/Button/Button';
import { BookingRequestModal } from '@/modules/bookings/components/BookingRequestModal/BookingRequestModal';
import type { WorkerSearchResult } from '@/types';
import styles from './Pages.module.css';
import sidebarStyles from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters.module.css';

const SKELETON_COUNT = 6;

export const SearchPage: React.FC = () => {
  const { filters, setFilter, setPage, resetFilters } = useSearchFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 960);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const activeFiltersCount = [
    filters.name,
    filters.category,
    filters.city,
    filters.availableOnly,
    filters.minExperience,
    filters.maxPrice,
  ].filter(Boolean).length;

  const showSidebar = isDesktop || isMobileFilterOpen;

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div>
        <h1 className={styles.sectionTitle}>Worker Marketplace</h1>
        <p className={styles.sectionSubtitle}>
          Discover and book verified local service professionals across regional hubs
        </p>
      </div>

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '300px 1fr' : '1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'start',
        }}
        className='searchLayoutGrid'
      >
        {showSidebar && (
          <div className='desktopSidebarWrapper'>
            {!isDesktop && isMobileFilterOpen && (
              <div
                className={sidebarStyles.mobileBackdrop}
                onClick={() => setIsMobileFilterOpen(false)}
              />
            )}
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
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />
          </div>
        )}

        <div>
          {searchWorkersQuery.isLoading ? (
            <div className='grid-auto-fit'>
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <WorkerCardSkeleton key={`skeleton-${index}`} />
              ))}
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
