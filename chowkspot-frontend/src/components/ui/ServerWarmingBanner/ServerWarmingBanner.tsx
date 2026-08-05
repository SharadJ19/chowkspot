import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import type { HealthCheckResponse } from '@/types';
import styles from './ServerWarmingBanner.module.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');

export const ServerWarmingBanner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);

  // Timer counter
  useEffect(() => {
    let timer: number;
    if (!isReady) {
      timer = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReady]);

  // Health check polling loop
  useEffect(() => {
    let isMounted = true;

    const checkHealth = async (): Promise<void> => {
      setRequestCount((prev) => prev + 1);
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data: HealthCheckResponse = await response.json();

        if (response.ok && data?.status === 'healthy' && isMounted) {
          setIsReady(true);
          setShowWelcome(true);

          // Adjusted to 4.5 seconds for a comfortable, professional reading experience
          window.setTimeout(() => {
            if (isMounted) setShowWelcome(false);
          }, 4500);

          return;
        } else {
          throw new Error('Not healthy');
        }
      } catch {
        if (isMounted) {
          setTimeout(() => {
            void checkHealth();
          }, 4000);
        }
      }
    };

    void checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  // If fully loaded and welcome message dismissed, render normal children
  if (isReady && !showWelcome) {
    return <>{children}</>;
  }

  // If server responded healthy, show comfortable reading welcome screen
  if (isReady && showWelcome) {
    return (
      <>
        {children}
        <div className={styles.overlay} role='dialog' aria-modal='true'>
          <div className={`${styles.card} ${styles.cardSuccess}`}>
            <div className={styles.headerRow}>
              <div className={`${styles.iconWrapper} ${styles.successIconWrapper}`}>
                <CheckCircle2 size={26} />
              </div>
              <div className={styles.titleGroup}>
                <span className={`${styles.tagline} ${styles.successTagline}`}>
                  All Systems Operational
                </span>
                <h3 className={styles.title}>You&apos;re Good to Go! 🚀</h3>
              </div>
            </div>

            <div className={styles.descriptionBox}>
              <p className={styles.descText}>
                <strong>Database &amp; Node cluster are fully awake.</strong> Experience
                lightning-fast worker discovery, real-time booking updates, and
                zero-commission direct P2P settlements.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-success)' }} />
              <span className={styles.footerNote}>Entering ChowkSpot Marketplace...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // While warming up (Cold start screen)
  return (
    <>
      {children}
      <div className={styles.overlay} role='dialog' aria-modal='true'>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div className={styles.iconWrapper}>
              <Cpu size={24} />
            </div>
            <div className={styles.titleGroup}>
              <span className={styles.tagline}>Infrastructure Cold-Start</span>
              <h3 className={styles.title}>Warming Up Backend Server</h3>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <p className={styles.descText}>
              <strong>Please wait 30 to 60 seconds.</strong> This backend and database are
              hosted on Render&apos;s free tier and spin down after inactivity. We are
              waking it up automatically.
            </p>
          </div>

          <div className={styles.diagnosticGrid}>
            <div className={styles.diagnosticBox}>
              <span className={styles.diagnosticLabel}>Elapsed Time</span>
              <span className={styles.diagnosticValue}>
                <span className={styles.pulseDot} />
                {elapsedSeconds}s elapsed
              </span>
            </div>
            <div className={styles.diagnosticBox}>
              <span className={styles.diagnosticLabel}>Request Count</span>
              <span className={styles.diagnosticValue}>
                <Terminal size={12} />
                Attempt #{requestCount}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-xs)',
            }}
          >
            <Spinner size='sm' color='primary' />
            <span className={styles.footerNote}>
              Pinging root /health endpoint every 4s...
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
