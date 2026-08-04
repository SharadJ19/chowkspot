import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { WorkerCard } from '@/modules/workers/components/WorkerCard/WorkerCard';
import { WorkerFilters } from '@/modules/workers/components/WorkerFilters/WorkerFilters';
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
  const { isAuthenticated } = useAuth();

  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const availableOnly = searchParams.get('availableOnly') === 'true';

  const { searchWorkersQuery } = useWorkerQueries({ category, city, availableOnly });
  const { createBookingMutation } = useBookingQueries();

  const [selectedWorker, setSelectedWorker] = useState<WorkerSearchResult | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWorker) return;

    try {
      await createBookingMutation.mutateAsync({
        workerId: selectedWorker.id,
        requestedDate,
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
          Find and book available local service providers
        </p>
      </div>

      <WorkerFilters
        selectedCategory={category}
        selectedCity={city}
        availableOnly={availableOnly}
        onCategoryChange={(val) => {
          if (val) searchParams.set('category', val);
          else searchParams.delete('category');
          setSearchParams(searchParams);
        }}
        onCityChange={(val) => {
          if (val) searchParams.set('city', val);
          else searchParams.delete('city');
          setSearchParams(searchParams);
        }}
        onAvailableOnlyChange={(val) => {
          if (val) searchParams.set('availableOnly', 'true');
          else searchParams.delete('availableOnly');
          setSearchParams(searchParams);
        }}
        onReset={() => setSearchParams({})}
      />

      {searchWorkersQuery.isLoading ? (
        <div className={styles.centerLoading}>
          <Spinner size='lg' />
        </div>
      ) : searchWorkersQuery.data && searchWorkersQuery.data.length > 0 ? (
        <div className='grid-auto-fit'>
          {searchWorkersQuery.data.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onBookClick={(w) => setSelectedWorker(w)}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>No service providers matched your filters.</p>
      )}

      <Modal
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={`Book ${selectedWorker?.user.name} (${selectedWorker?.category})`}
      >
        {!isAuthenticated ? (
          <p style={{ fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
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
              label='Requested Date & Time'
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
