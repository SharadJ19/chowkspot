import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import type { AuthUser } from '@/types';
import styles from './AdminDeleteModal.module.css';

interface AdminDeleteModalProps {
  userToDelete: AuthUser | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  userToDelete,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}) => {
  if (!userToDelete) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Confirm User Account Removal'>
      <div className={styles.modalContent}>
        <div className={styles.warningBox}>
          <AlertTriangle size={24} />
          <p className={styles.warningText}>
            Warning: Removing <strong>{userToDelete.name}</strong> ({userToDelete.email})
            will permanently delete their profile, active worker listings, bookings, and
            submitted reviews.
          </p>
        </div>

        <div className={styles.modalButtonRow}>
          <Button variant='outline' onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant='danger'
            isLoading={isPending}
            onClick={() => onConfirm(userToDelete.id)}
          >
            Permanently Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};
