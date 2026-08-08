// FILE: src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { toast } from 'sonner';
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

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const availableOnly = searchParams.get('availableOnly') === 'true';
  const name = searchParams.get('name') || '';
  const minExperience = searchParams.get('minExp')
    ? parseInt(searchParams.get('minExp')!, 10)
    : undefined;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Hook handles full backend query execution
  const { searchWorkersQuery } = useWorkerQueries({
    name,
    category,
    city,
    availableOnly,
    minExperience,
    maxPrice,
    page,
    limit: 12,
  });

  const { createBookingMutation } = useBookingQueries();

  const [selectedWorker, setSelectedWorker] = useState<WorkerSearchResult | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const workers = searchWorkersQuery.data?.workers || [];
  const pagination = searchWorkersQuery.data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  const handlePageChange = (newPage: number) => {
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

      // 👈 Toast UI Acknowledgement
      toast.success(`Booking request sent to ${selectedWorker.user.name}!`, {
        description: 'You can track status updates in your "My Bookings" tab.',
      });

      setSelectedWorker(null);
      setRequestedDate('');
      setAddress('');
      setNotes('');
    } catch (err) {
      const msg = (err as Error).message || 'Failed to submit booking request';
      setBookingError(msg);
      toast.error('Booking submission failed', { description: msg });
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
          searchName={name}
          selectedCategory={category}
          selectedCity={city}
          availableOnly={availableOnly}
          minExperience={minExperience || 0}
          maxPrice={maxPrice || 3000}
          onSearchNameChange={(val) => {
            if (val) searchParams.set('name', val);
            else searchParams.delete('name');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onCategoryChange={(val) => {
            if (val) searchParams.set('category', val);
            else searchParams.delete('category');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onCityChange={(val) => {
            if (val) searchParams.set('city', val);
            else searchParams.delete('city');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onAvailableOnlyChange={(val) => {
            if (val) searchParams.set('availableOnly', 'true');
            else searchParams.delete('availableOnly');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onMinExperienceChange={(val) => {
            if (val > 0) searchParams.set('minExp', val.toString());
            else searchParams.delete('minExp');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onMaxPriceChange={(val) => {
            if (val < 3000) searchParams.set('maxPrice', val.toString());
            else searchParams.delete('maxPrice');
            searchParams.set('page', '1');
            setSearchParams(searchParams);
          }}
          onReset={() => {
            setSearchParams({});
          }}
          currentPage={pagination.page} // 👈 Passed to Sidebar
          itemsPerPage={pagination.limit} // 👈 Passed to Sidebar
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
        ) : !user?.isVerified ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>
              Email Verification Required
            </p>
            <p
              style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-slate-600)' }}
            >
              Please verify your email address (<strong>{user?.email}</strong>) to send
              booking requests to workers.
            </p>
          </div>
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
