import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import type { HealthCheckResponse } from '@/types';
import styles from './ServerWarmingBanner.module.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');
const MAX_ATTEMPTS = 22; // ~90 seconds timeout safety window

export const ServerWarmingBanner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);

  const requestCountRef = useRef(0);

  // Timer counter for elapsed seconds
  useEffect(() => {
    if (isReady || hasTimedOut) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isReady, hasTimedOut]);

  // Health check polling loop
  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const checkHealth = async () => {
      if (!isMounted || isReady || hasTimedOut) return;

      requestCountRef.current += 1;
      setRequestCount(requestCountRef.current);

      if (requestCountRef.current > MAX_ATTEMPTS) {
        setHasTimedOut(true);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data: HealthCheckResponse = await response.json();

        if (response.ok && data?.status === 'healthy' && isMounted) {
          setIsReady(true);
          setShowWelcome(true);
          return; // Server is ready, stop polling!
        } else {
          throw new Error('Not healthy');
        }
      } catch {
        if (isMounted) {
          timeoutId = window.setTimeout(() => {
            void checkHealth();
          }, 4000);
        }
      }
    };

    void checkHealth();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [isReady, hasTimedOut]);

  // Dedicated standalone timer for the welcome screen duration (4.5 seconds)
  useEffect(() => {
    if (!showWelcome) return;

    const welcomeTimer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 1200);

    return () => window.clearTimeout(welcomeTimer);
  }, [showWelcome]);

  // If fully loaded and welcome screen is finished, render application children normally
  if (isReady && !showWelcome) {
    return <>{children}</>;
  }

  // If max timeout (~90s) reached, allow user to retry
  if (hasTimedOut) {
    return (
      <>
        {children}
        <div className={styles.overlay} role='dialog' aria-modal='true'>
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderColor: '#fca5a5',
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div className={styles.titleGroup}>
                <span className={styles.tagline} style={{ color: '#991b1b' }}>
                  Connection Timeout
                </span>
                <h3 className={styles.title}>Server Is Taking Too Long</h3>
              </div>
            </div>

            <div className={styles.descriptionBox}>
              <p className={styles.descText}>
                We couldn&apos;t reach the Render backend after 90 seconds. The service
                might be experiencing an unexpected deployment delay or temporary platform
                downtime.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: 'var(--color-primary-600)',
                color: 'var(--color-text-inverse)',
                fontWeight: 'bold',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
              }}
            >
              Retry Connection
            </button>
          </div>
        </div>
      </>
    );
  }

  // If server responded healthy, show welcome screen
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
                <strong>Render backend &amp; Neon DB cluster are fully active.</strong>{' '}
                Experience lightning-fast worker matching, real-time booking updates, and
                zero-commission direct P2P settlements without any friction.
              </p>
            </div>

            <div className={styles.successFooterRow}>
              <Sparkles size={14} className={styles.successSparkleIcon} />
              <span className={styles.footerNoteText}>
                Entering ChowkSpot Marketplace...
              </span>
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
              <h3 className={styles.title}>Warming Up Services</h3>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <p className={styles.descText}>
              <strong>Please wait 30 to 60 seconds.</strong> The Node.js backend hosted on{' '}
              <strong>Render</strong> spins down after inactivity. Once our API receives
              this request, it wakes up and connects to our serverless{' '}
              <strong>Neon DB</strong> database.
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

          <div className={styles.loadingFooterRow}>
            <Spinner size='sm' color='primary' />
            <span className={styles.footerNoteText}>
              Pinging root /health endpoint every 4s...
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
