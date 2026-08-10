import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import type { WorkerSearchResult } from '@/types';
import pagesStyles from '@/pages/Pages.module.css';
import styles from './BookingRequestModal.module.css';

export interface BookingRequestModalProps {
  worker: WorkerSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
  worker,
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { createBookingMutation } = useBookingQueries();

  const [requestedDate, setRequestedDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const resetForm = () => {
    setRequestedDate('');
    setAddress('');
    setNotes('');
    setBookingError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBookSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!worker) return;
    setBookingError(null);

    try {
      const formattedIsoDate = new Date(requestedDate).toISOString();
      await createBookingMutation.mutateAsync({
        workerId: worker.id,
        requestedDate: formattedIsoDate,
        address,
        notes,
      });

      toast.success(`Booking request sent to ${worker.user.name}!`, {
        description: 'You can track status updates in your "My Bookings" tab.',
      });

      handleClose();
    } catch (err) {
      const msg = (err as Error).message || 'Failed to submit booking request';
      setBookingError(msg);
      toast.error('Booking submission failed', { description: msg });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={worker ? `Book ${worker.user.name} (${worker.category})` : 'Book Service'}
    >
      {!isAuthenticated ? (
        <p className={styles.unauthText}>Please log in to submit a booking request.</p>
      ) : !user?.isVerified ? (
        <div className={styles.verificationBox}>
          <p className={styles.errorText}>Email Verification Required</p>
          <p className={styles.emailText}>
            Please verify your email address (<strong>{user?.email}</strong>) to send
            booking requests to workers.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBookSubmit} className={styles.container}>
          {bookingError && <div className={styles.bannerError}>{bookingError}</div>}

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

          <div className={pagesStyles.formArea}>
            <label className={pagesStyles.formLabel}>Notes / Task Description</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Describe the repair or installation requirements...'
              className={pagesStyles.textareaInput}
            />
          </div>

          <Button type='submit' isLoading={createBookingMutation.isPending} fullWidth>
            Send Booking Request
          </Button>
        </form>
      )}
    </Modal>
  );
};
