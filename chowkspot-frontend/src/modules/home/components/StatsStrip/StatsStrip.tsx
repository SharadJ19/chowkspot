import React from 'react';
import styles from './StatsStrip.module.css';

export const StatsStrip: React.FC = () => {
  return (
    <section className={styles.statsStrip}>
      <div className={`container ${styles.statsContainer}`}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>0%</span>
          <span className={styles.statLabel}>Platform Fees or Cut</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statBox}>
          <span className={styles.statNumber}>80+</span>
          <span className={styles.statLabel}>Cities Across Regional Belt</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statBox}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Direct Peer-to-Peer Settlement</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statBox}>
          <span className={styles.statNumber}>80+</span>
          <span className={styles.statLabel}>Unique Service Skills</span>
        </div>
      </div>
    </section>
  );
};
