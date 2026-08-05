import React from 'react';
import { Link } from 'react-router';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Heart,
  Zap,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo/Logo';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        {/* Top Feature Highlights Bar */}
        <div className={styles.featureBar}>
          <div className={styles.featureItem}>
            <Zap className={styles.featureIcon} size={20} />
            <div>
              <h4 className={styles.featureTitle}>Zero Platform Fees</h4>
              <p className={styles.featureDesc}>
                100% direct transactions via peer-to-peer UPI or Cash
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <ShieldCheck className={styles.featureIcon} size={20} />
            <div>
              <h4 className={styles.featureTitle}>Verified Reviews</h4>
              <p className={styles.featureDesc}>
                Ratings only from users with completed booking records
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <Heart className={styles.featureIcon} size={20} />
            <div>
              <h4 className={styles.featureTitle}>Community First</h4>
              <p className={styles.featureDesc}>
                Empowering independent local workers and tradespeople
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Brand Info Column */}
          <div className={styles.brandColumn}>
            <Link to='/' className={styles.brandLogo} aria-label='ChowkSpot Home'>
              <Logo variant='wordmark' size='md' color='var(--color-slate-100)' />
            </Link>
            <p className={styles.brandDesc}>
              ChowkSpot is an open, zero-commission service marketplace connecting
              residents directly with local skilled professionals across Himachal Pradesh
              and the Tricity region.
            </p>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>Parwanoo, Himachal Pradesh 173220</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <a href='mailto:support@chowkspot.com'>support@chowkspot.com</a>
              </div>
              <div className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <a href='tel:+919876543210'>+91 98765 43210</a>
              </div>
            </div>
          </div>

          {/* Service Domains Column */}
          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>Popular Services</h3>
            <ul className={styles.linkList}>
              {APP_CONSTANTS.CATEGORIES.slice(0, 6).map((category) => (
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

          {/* Quick Navigation Column */}
          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>Marketplace</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to='/search' className={styles.footerLink}>
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to='/register' className={styles.footerLink}>
                  Join as Skilled Worker
                </Link>
              </li>
              <li>
                <Link to='/bookings' className={styles.footerLink}>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to='/login' className={styles.footerLink}>
                  Account Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Region Network Column */}
          <div className={styles.linkColumn}>
            <h3 className={styles.columnTitle}>Service Regions</h3>
            <p className={styles.regionDesc}>Active regional coverage across:</p>
            <div className={styles.tagCloud}>
              {APP_CONSTANTS.CITIES.slice(0, 8).map((city) => (
                <Link
                  key={city}
                  to={`/search?city=${encodeURIComponent(city)}`}
                  className={styles.regionTag}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Links & Copyright */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ChowkSpot Marketplace. All rights reserved.
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
