import React from 'react';
import { Link } from 'react-router';
import {
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo/Logo';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.mainGrid}>
          <div className={styles.brandColumn}>
            <Link to='/' className={styles.brandLogo} aria-label='ChowkSpot Home'>
              <Logo variant='wordmark' size='md' color='var(--color-slate-100)' />
            </Link>

            <p className={styles.brandDesc}>
              ChowkSpot is an open, zero-commission service marketplace connecting
              residents directly with local skilled professionals across Himachal Pradesh,
              Tricity, and North India.
            </p>

            <div className={styles.liveStatusBadge}>
              <span className={styles.pulseDot} />
              <span>ChowkSpot Network Active • 85+ Regional Hubs</span>
            </div>

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>Plot 42, Sector 17-E, Chandigarh Tech Enclave, UT 160017</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <a href='mailto:support@chowkspot.com'>support@chowkspot.com</a>
              </div>
              <div className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <a href='tel:+917590889608'>+91 75908 89608</a>
              </div>
            </div>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>Popular Trades</h3>
            <ul className={styles.linkList}>
              {APP_CONSTANTS.CATEGORIES.slice(0, 7).map((category) => (
                <li key={category}>
                  <Link
                    to={`/search?category=${encodeURIComponent(category)}`}
                    className={styles.footerLink}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>More Services</h3>
            <ul className={styles.linkList}>
              {APP_CONSTANTS.CATEGORIES.slice(7, 14).map((category) => (
                <li key={category}>
                  <Link
                    to={`/search?category=${encodeURIComponent(category)}`}
                    className={styles.footerLink}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>Marketplace</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to='/search' className={styles.footerLink}>
                  Find Skilled Workers
                </Link>
              </li>
              <li>
                <Link to='/register?role=WORKER' className={styles.footerLink}>
                  Join as Skilled Worker
                </Link>
              </li>
              <li>
                <Link to='/bookings' className={styles.footerLink}>
                  My Service Bookings
                </Link>
              </li>
              <li>
                <Link to='/login' className={styles.footerLink}>
                  Account Login
                </Link>
              </li>
              <li>
                <Link to='/register' className={styles.footerLink}>
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ChowkSpot Service Marketplace. All rights
            reserved.
          </p>

          <div className={styles.legalLinks}>
            <span className={styles.legalItem}>
              <FileText size={12} />
              <span>Terms of Service</span>
            </span>
            <span className={styles.legalItem}>
              <Lock size={12} />
              <span>Privacy Policy</span>
            </span>
            <span className={styles.legalItem}>
              <HelpCircle size={12} />
              <span>Help Center</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

