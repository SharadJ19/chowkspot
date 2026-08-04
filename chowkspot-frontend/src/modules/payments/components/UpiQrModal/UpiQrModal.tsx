import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import styles from './UpiQrModal.module.css';

export interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  payeeName: string;
  amount?: number;
  upiUri: string;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  isOpen,
  onClose,
  upiId,
  payeeName,
  amount,
  upiUri,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Zero-Commission Direct UPI Payment'>
      <div className={styles.container}>
        <p className={styles.description}>
          Pay directly to <strong>{payeeName}</strong> using any UPI App (GPay, PhonePe,
          Paytm).
        </p>

        <div className={styles.upiBox}>
          <Smartphone size={32} className={styles.upiIcon} />
          <p className={styles.upiIdText}>{upiId}</p>
        </div>

        {amount && <span className={styles.amountText}>Amount: ₹{amount}</span>}

        <div className={styles.buttonRow}>
          <a href={upiUri} className={styles.appLink}>
            <Button variant='primary' fullWidth>
              <ExternalLink size={16} />
              <span>Open UPI App</span>
            </Button>
          </a>
          <Button variant='outline' onClick={onClose} style={{ flex: 1 }}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
