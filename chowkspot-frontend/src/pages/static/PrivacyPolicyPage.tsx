import React from 'react';
import { Lock } from 'lucide-react';
import styles from './StaticPages.module.css';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className={`container ${styles.staticPageContainer}`}>
      <div className={styles.headerCard}>
        <div className={styles.badgePill}>
          <Lock size={14} />
          <span>Data Protection &amp; Integrity</span>
        </div>
        <h1 className={styles.pageTitle}>Privacy Policy</h1>
        <p className={styles.pageSubtitle}>
          How ChowkSpot handles, secures, and minimizes personal data across our
          hyperlocal network.
        </p>
      </div>

      <div className={styles.contentCard}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          <p className={styles.paragraph}>
            We adhere to strict data minimization principles. We only collect details
            necessary to facilitate local bookings and account authentication:
          </p>
          <div className={styles.bulletList}>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Account Credentials:</strong> Name, verified email address, phone
                number, and primary city hub.
              </span>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Worker Profile Details:</strong> Trade category, experience years,
                base pricing rates, service cities, and optional UPI handles for payment
                QR generation.
              </span>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Booking Coordinates:</strong> Service addresses and notes provided
                during job requests.
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Authentication &amp; Token Security</h2>
          <p className={styles.paragraph}>
            Passswords are salted and hashed using modern cryptographic algorithms.
            Authentication sessions leverage short-lived JWT access tokens accompanied by
            refresh tokens stored securely inside <code>httpOnly</code>,{' '}
            <code>SameSite=Strict</code>, and encrypted HTTP cookies to prevent Cross-Site
            Scripting (XSS) extraction.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Third-Party Data Sharing</h2>
          <p className={styles.paragraph}>
            ChowkSpot does not sell, rent, or monetize your personal information. Profile
            pictures and worker trade details are publicly discoverable on the
            marketplace. Customer contact numbers and service addresses are disclosed
            solely to the specific professional chosen for a confirmed booking.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            4. Right to Deletion (Self-Account Wipe)
          </h2>
          <p className={styles.paragraph}>
            Users maintain full sovereignty over their records. You may permanently delete
            your profile, active worker listings, and booking history directly through
            your Account Profile settings at any time.
          </p>
        </section>
      </div>
    </div>
  );
};
