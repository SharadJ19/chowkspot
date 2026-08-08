import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // 👈 Client-side dynamic SVG QR code renderer
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
          Scan the QR code with any UPI App (GPay, PhonePe, Paytm) or tap the button below
          to pay <strong>{payeeName}</strong> directly.
        </p>

        {/* Dynamic On-The-Fly QR Code Box */}
        <div className={styles.qrCodeBox}>
          <QRCodeSVG
            value={upiUri}
            size={180}
            level='M'
            includeMargin={true}
            imageSettings={{
              src: '/favicon.svg',
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        <div className={styles.upiBox}>
          <Smartphone size={18} className={styles.upiIcon} />
          <span className={styles.upiIdText}>VPA: {upiId}</span>
        </div>

        {amount && <span className={styles.amountText}>Amount to Pay: ₹{amount}</span>}

        <div className={styles.buttonRow}>
          <a href={upiUri} className={styles.appLink}>
            <Button variant='primary' fullWidth>
              <ExternalLink size={16} />
              <span>Open UPI App (Mobile)</span>
            </Button>
          </a>
          <Button variant='outline' onClick={onClose} style={{ flex: 1 }}>
            Done / Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
