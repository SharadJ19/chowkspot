import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import {
  Cpu,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button/Button';
import type { HealthCheckResponse } from '@/types';
import styles from './ServerWarmingBanner.module.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');
const MAX_ATTEMPTS = 15; // 15 attempts * 4 seconds = 60 seconds strict timeout limit
const SESSION_CACHE_KEY = 'chowkspot_server_warmed';
const RENDER_IDLE_TIMEOUT_MS = 14 * 60 * 1000; // 14 minutes (just under Render's 15-min idle rule)

const STRICT_ROUTES = [
  '/search',
  '/login',
  '/register',
  '/bookings',
  '/profile',
  '/admin',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

// Helper to check if session cache is still valid based on Render's 15m idle window
const isServerRecentlyWarmed = (): boolean => {
  try {
    const cachedTimestamp = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!cachedTimestamp) return false;
    const parsedTime = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    return now - parsedTime < RENDER_IDLE_TIMEOUT_MS;
  } catch {
    return false;
  }
};

export const ServerWarmingBanner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  // Initialize state directly from session storage to prevent unnecessary flashes on refresh
  const [isReady, setIsReady] = useState<boolean>(isServerRecentlyWarmed());
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);

  const isStrictRoute = STRICT_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );

  // Timer counter for elapsed seconds
  useEffect(() => {
    if (isReady || hasTimedOut) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isReady, hasTimedOut]);

  // Robust manual and automated ping function
  const pingServer = useCallback(async () => {
    if (isReady || hasTimedOut) return;

    setRequestCount((prevCount) => {
      const nextCount = prevCount + 1;
      if (nextCount > MAX_ATTEMPTS) {
        setHasTimedOut(true);
      }
      return nextCount;
    });

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: HealthCheckResponse = await response.json();

      if (response.ok && data?.status === 'healthy') {
        setIsReady(true);
        setShowWelcome(true);
        // 🚀 Save timestamp to session storage to bypass future refreshes for 14 minutes!
        try {
          sessionStorage.setItem(SESSION_CACHE_KEY, Date.now().toString());
        } catch {
          // sessionStorage fallback restriction handling
        }
      }
    } catch {
      // Silently catch and let interval handle next poll
    }
  }, [isReady, hasTimedOut]);

  // Automated background polling loop (every 4 seconds)
  useEffect(() => {
    if (isReady || hasTimedOut) return;

    const pollInterval = window.setInterval(() => {
      void pingServer();
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [isReady, hasTimedOut, pingServer]);

  // Welcome screen duration timer (1.2 seconds)
  useEffect(() => {
    if (!showWelcome) return;

    const welcomeTimer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 1200);

    return () => window.clearTimeout(welcomeTimer);
  }, [showWelcome]);

  if (isReady && !showWelcome) {
    return <>{children}</>;
  }

  // Timeout state (exceeded 60 seconds)
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
                <h3 className={styles.title}>Server Is Taking Longer Than Usual</h3>
              </div>
            </div>
            <div className={styles.descriptionBox}>
              <p className={styles.descText}>
                The Render backend is taking more than 60 seconds to respond. Please check
                your network connection or try reloading.
              </p>
            </div>
            <Button variant='primary' fullWidth onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        </div>
      </>
    );
  }

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
                <h3 className={styles.title}>You&apos;re Good to Go!</h3>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Non-blocking sleek floating status pill for Homepage & general navigation
  if (!isStrictRoute) {
    return (
      <>
        {children}
        <div
          className={styles.floatingPillContainer}
          role='status'
          aria-label='Warming server'
        >
          <span className={styles.pillDot} />
          <span className={styles.pillText}>
            Warming server backend <strong>({elapsedSeconds}s)</strong>...
          </span>
        </div>
      </>
    );
  }

  const progressPercent = Math.min((elapsedSeconds / 30) * 100, 100);
  const isTakingLonger = elapsedSeconds > 30;

  return (
    <>
      {children}
      <div className={styles.overlay} role='dialog' aria-modal='true'>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div className={styles.iconWrapper}>
              <Cpu size={26} />
            </div>
            <div className={styles.titleGroup}>
              <span className={styles.tagline}>Infrastructure Cold-Start</span>
              <h3 className={styles.title}>Warming Up Services</h3>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <p className={styles.descText}>
              {isTakingLonger ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-warning)',
                    fontWeight: 700,
                  }}
                >
                  <AlertCircle size={14} /> This is taking a little longer than usual. The
                  Render server is waking up from deep sleep...
                </span>
              ) : (
                <>
                  <strong>Please wait 20 to 30 seconds.</strong> The backend hosted on{' '}
                  <strong>Render</strong> spins down after inactivity and is now
                  reconnecting to <strong>Neon DB</strong>.
                </>
              )}
            </p>
            <button
              className={styles.accordionToggle}
              onClick={() => setShowTechDetails(!showTechDetails)}
            >
              <span>
                {showTechDetails ? 'Hide technical details' : 'What is happening?'}
              </span>
              {showTechDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showTechDetails && (
              <p
                className={styles.descText}
                style={{ marginTop: '4px', color: 'var(--color-slate-500)' }}
              >
                Free-tier cloud hosting puts idle instances to sleep to conserve
                resources. Your request sends an instant signal to boot the container back
                up.
              </p>
            )}
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className={styles.diagnosticGrid}>
            <div className={styles.diagnosticBox}>
              <span className={styles.diagnosticLabel}>Elapsed Time</span>
              <span className={styles.diagnosticValue}>
                <Clock size={12} style={{ color: 'var(--color-warning)' }} />
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

          <div className={styles.buttonRow}>
            <Button
              variant='primary'
              size='md'
              fullWidth
              onClick={() => void pingServer()}
            >
              <RefreshCw size={16} />
              <span>Wake Up Now</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
