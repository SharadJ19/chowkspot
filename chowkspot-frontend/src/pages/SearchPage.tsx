import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { WorkerCard } from '@/modules/workers/components/WorkerCard/WorkerCard';
import { WorkerSidebarFilters } from '@/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { useAuth } from '@/hooks/useAuth';
import type { WorkerSearchResult } from '@/types';
import styles from './Pages.module.css';

const ITEMS_PER_PAGE = 12;

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const availableOnly = searchParams.get('availableOnly') === 'true';
  const searchName = searchParams.get('name') || '';
  const minExperience = parseInt(searchParams.get('minExp') || '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || '3000', 10);
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [currentPage, setCurrentPage] = useState<number>(
    isNaN(pageParam) ? 1 : pageParam,
  );

  const { searchWorkersQuery } = useWorkerQueries({ category, city, availableOnly });
  const { createBookingMutation } = useBookingQueries();

  const [selectedWorker, setSelectedWorker] = useState<WorkerSearchResult | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Client-side filtering for search by name, experience years slider, and price range slider
  const filteredWorkers = useMemo(() => {
    const rawList = searchWorkersQuery.data || [];
    return rawList.filter((worker) => {
      // Name filter
      if (
        searchName &&
        !worker.user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        !worker.category.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }
      // Experience filter
      if (worker.experienceYears < minExperience) return false;

      // Price filter
      const rateNum = parseFloat(worker.baseRate) || 0;
      if (rateNum > maxPrice) return false;

      return true;
    });
  }, [searchWorkersQuery.data, searchName, minExperience, maxPrice]);

  const totalPages = Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE) || 1;
  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWorkers, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setBookingError(null);

    try {
      const formattedIsoDate = new Date(requestedDate).toISOString();
      await createBookingMutation.mutateAsync({
        workerId: selectedWorker.id,
        requestedDate: formattedIsoDate,
        address,
        notes,
      });

      setSelectedWorker(null);
      setRequestedDate('');
      setAddress('');
      setNotes('');
    } catch (err) {
      setBookingError((err as Error).message || 'Failed to submit booking request');
    }
  };

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div>
        <h1 className={styles.sectionTitle}>Worker Marketplace</h1>
        <p className={styles.sectionSubtitle}>
          Discover and book verified local service professionals across regional hubs
        </p>
      </div>

      {/* E-Commerce Two-Column Layout Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'start',
        }}
        className='searchLayoutGrid'
      >
        {/* Left Sidebar Filters */}
        <WorkerSidebarFilters
          searchName={searchName}
          selectedCategory={category}
          selectedCity={city}
          availableOnly={availableOnly}
          minExperience={minExperience}
          maxPrice={maxPrice}
          onSearchNameChange={(val) => {
            if (val) searchParams.set('name', val);
            else searchParams.delete('name');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onCategoryChange={(val) => {
            if (val) searchParams.set('category', val);
            else searchParams.delete('category');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onCityChange={(val) => {
            if (val) searchParams.set('city', val);
            else searchParams.delete('city');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onAvailableOnlyChange={(val) => {
            if (val) searchParams.set('availableOnly', 'true');
            else searchParams.delete('availableOnly');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onMinExperienceChange={(val) => {
            if (val > 0) searchParams.set('minExp', val.toString());
            else searchParams.delete('minExp');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onMaxPriceChange={(val) => {
            if (val < 3000) searchParams.set('maxPrice', val.toString());
            else searchParams.delete('maxPrice');
            searchParams.delete('page');
            setCurrentPage(1);
            setSearchParams(searchParams);
          }}
          onReset={() => {
            setSearchParams({});
            setCurrentPage(1);
          }}
          totalResults={filteredWorkers.length}
        />

        {/* Right Product Grid */}
        <div>
          {searchWorkersQuery.isLoading ? (
            <div className={styles.centerLoading}>
              <Spinner size='lg' />
            </div>
          ) : paginatedWorkers.length > 0 ? (
            <>
              <div className='grid-auto-fit'>
                {paginatedWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onBookClick={(w) => setSelectedWorker(w)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className={styles.emptyMessage}>
              No service providers matched your search filters.
            </p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={`Book ${selectedWorker?.user.name} (${selectedWorker?.category})`}
      >
        {!isAuthenticated ? (
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              textAlign: 'center',
              padding: 'var(--spacing-md)',
            }}
          >
            Please log in to submit a booking request.
          </p>
        ) : (
          <form
            onSubmit={handleBookSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
          >
            {bookingError && (
              <div
                style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)' }}
              >
                {bookingError}
              </div>
            )}

            <Input
              label='Requested Date &amp; Time'
              type='datetime-local'
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />

            <Input
              label='Service Address'
              placeholder='House #, Street, Locality'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className={styles.formArea}>
              <label className={styles.formLabel}>Notes / Task Description</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Describe the repair or installation requirements...'
                className={styles.textareaInput}
              />
            </div>

            <Button type='submit' isLoading={createBookingMutation.isPending} fullWidth>
              Send Booking Request
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
