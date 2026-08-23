import React from 'react';
import { FileText } from 'lucide-react';
import styles from './StaticPages.module.css';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className={`container ${styles.staticPageContainer}`}>
      <div className={styles.headerCard}>
        <div className={styles.badgePill}>
          <FileText size={14} />
          <span>Operational Agreement</span>
        </div>
        <h1 className={styles.pageTitle}>Terms of Service</h1>
        <p className={styles.pageSubtitle}>
          Effective date: August 2026. Please read these terms carefully before utilizing
          the ChowkSpot platform.
        </p>
      </div>

      <div className={styles.contentCard}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Platform Nature &amp; Scope</h2>
          <p className={styles.paragraph}>
            ChowkSpot is an open, free, two-sided hyperlocal discovery utility connecting
            independent skilled service providers (&quot;Workers&quot;) with neighborhood
            residents (&quot;Customers&quot;). ChowkSpot is not an employer, contractor,
            or broker. All service contracts exist directly and solely between the
            customer and the service professional.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Zero-Commission &amp; Peer-to-Peer Payments
          </h2>
          <p className={styles.paragraph}>
            ChowkSpot operates on a zero-commission model (0% platform cut). All financial
            settlements—whether executed via direct Unified Payments Interface (UPI) deep
            links, QR code scans, or cash—are peer-to-peer (P2P) transfers. ChowkSpot does
            not hold funds in escrow, handle payment custody, or charge payment gateway
            transaction fees.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. User &amp; Worker Conduct</h2>
          <div className={styles.bulletList}>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Accurate Profile Representation:</strong> Workers agree to provide
                accurate information regarding trade skills, baseline pricing, and service
                city coverage.
              </span>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Direct State Tracking:</strong> Both parties agree to utilize the
                in-app booking state machine honestly (Accepting, Counter-Proposing, and
                Marking Jobs as Complete).
              </span>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>
                <strong>Verified Reviews Guard:</strong> Customer reviews can only be
                submitted following a verified, completed service booking record.
                Fraudulent or malicious reviews are strictly moderated and removed.
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
          <p className={styles.paragraph}>
            ChowkSpot facilitates contact and scheduling only. The platform is not liable
            for quality of craftsmanship, property damages, delays, cancellations, or
            pricing disputes. Customers are encouraged to verify credentials and negotiate
            final scope during inspection.
          </p>
        </section>
      </div>
    </div>
  );
};
