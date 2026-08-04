import React from 'react';
import { Link } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo/Logo';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.brand}>
              <Logo variant='wordmark' size='md' color='var(--color-slate-100)' />
            </div>
            <p className={styles.subtitle}>
              Zero-commission local marketplace connecting skilled workers across India.
            </p>
          </div>

          <div className={styles.linksGroup}>
            <div className={styles.linkColumn}>
              <span className={styles.columnTitle}>Marketplace</span>
              <Link to='/search' className={styles.footerLink}>
                Find Workers
              </Link>
              <Link to='/register' className={styles.footerLink}>
                Become a Worker
              </Link>
            </div>
            <div className={styles.linkColumn}>
              <span className={styles.columnTitle}>Regions</span>
              <span className={styles.footerLink}>Chandigarh</span>
              <span className={styles.footerLink}>Parwanoo</span>
              <span className={styles.footerLink}>Mohali</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <span>&copy; {new Date().getFullYear()} ChowkSpot. All rights reserved.</span>
          <span className={styles.communityNote}>
            <ShieldCheck size={14} />
            <span>Built for local community empowerment</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
