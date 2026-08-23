import React from 'react';
import { LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import styles from './ProfileAccountActions.module.css';

interface ProfileAccountActionsProps {
  isLoggingOut: boolean;
  isDeleting: boolean;
  isDeleteModalOpen: boolean;
  deleteConfirmationText: string;
  onLogout: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
  onConfirmationTextChange: (text: string) => void;
  onConfirmDelete: () => void;
}

export const ProfileAccountActions: React.FC<ProfileAccountActionsProps> = ({
  isLoggingOut,
  isDeleting,
  isDeleteModalOpen,
  deleteConfirmationText,
  onLogout,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onConfirmationTextChange,
  onConfirmDelete,
}) => {
  return (
    <>
      <div className={styles.accountActionsCard}>
        <div className={styles.actionSection}>
          <div className={styles.actionTextGroup}>
            <span className={styles.actionTitle}>Log Out of Session</span>
            <span className={styles.actionDesc}>
              Securely end your current session on this device.
            </span>
          </div>
          <Button variant='outline' onClick={onLogout} isLoading={isLoggingOut}>
            <LogOut size={16} />
            <span>Log Out</span>
          </Button>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionSection}>
          <div className={styles.actionTextGroup}>
            <span className={styles.actionTitle} style={{ color: 'var(--color-error)' }}>
              Danger Zone
            </span>
            <span className={styles.actionDesc}>
              Permanently delete your account and all associated marketplace data.
            </span>
          </div>
          <Button variant='danger' onClick={onOpenDeleteModal}>
            <Trash2 size={16} />
            <span>Delete Account</span>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        title='Confirm Account Deletion'
      >
        <div className={styles.modalContent}>
          <div className={styles.warningBox}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <p className={styles.warningText}>
              This action is permanent and irreversible. All your profile data, booking
              history, ratings, and active listings will be wiped.
            </p>
          </div>

          <Input
            label='Type "DELETE" to confirm'
            placeholder='DELETE'
            value={deleteConfirmationText}
            onChange={(e) => onConfirmationTextChange(e.target.value)}
          />

          <div className={styles.modalButtonRow}>
            <Button variant='outline' onClick={onCloseDeleteModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant='danger'
              isLoading={isDeleting}
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={onConfirmDelete}
            >
              Permanently Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
