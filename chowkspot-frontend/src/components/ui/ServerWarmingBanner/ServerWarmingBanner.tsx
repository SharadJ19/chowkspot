import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import type { HealthCheckResponse } from '@/types';
import styles from './ServerWarmingBanner.module.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');
const MAX_ATTEMPTS = 15;
const SESSION_CACHE_KEY = 'chowkspot_server_warmed';
const RENDER_IDLE_TIMEOUT_MS = 14 * 60 * 1000;
const COLD_START_MIN_WAIT_SECONDS = 5;

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

const isServerRecentlyWarmed = (): boolean => {
  try {
    const cachedTimestamp = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!cachedTimestamp) return false;
    const parsedTime = parseInt(cachedTimestamp, 10);
    return Date.now() - parsedTime < RENDER_IDLE_TIMEOUT_MS;
  } catch {
    return false;
  }
};

export const ServerWarmingBanner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const isBypassed = import.meta.env.DEV || import.meta.env.MODE === 'test';

  const [isReady, setIsReady] = useState<boolean>(
    isBypassed ? true : isServerRecentlyWarmed(),
  );
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);

  const mountTimestampRef = useRef<number | null>(null);
  const attemptsRef = useRef<number>(0);

  const isStrictRoute = STRICT_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );

  useEffect(() => {
    if (isBypassed || isReady || hasTimedOut) return;

    if (mountTimestampRef.current === null) {
      mountTimestampRef.current = Date.now();
    }

    const timer = window.setInterval(() => {
      if (mountTimestampRef.current !== null) {
        const seconds = Math.floor((Date.now() - mountTimestampRef.current) / 1000);
        setElapsedSeconds(seconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBypassed, isReady, hasTimedOut]);

  const pingServer = useCallback(async () => {
    if (isBypassed || isReady || hasTimedOut) return;

    attemptsRef.current += 1;
    if (attemptsRef.current > MAX_ATTEMPTS) {
      setHasTimedOut(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: HealthCheckResponse = await response.json();

      if (response.ok && data?.status === 'healthy') {
        const startTime = mountTimestampRef.current ?? Date.now();
        const totalWaitTimeSeconds = (Date.now() - startTime) / 1000;
        const hadColdStartWait = totalWaitTimeSeconds >= COLD_START_MIN_WAIT_SECONDS;

        setIsReady(true);
        setShowWelcome(hadColdStartWait);

        try {
          sessionStorage.setItem(SESSION_CACHE_KEY, Date.now().toString());
        } catch {
          // fallback
        }
      }
    } catch {
      // Silently catch network drops during boot
    }
  }, [isBypassed, isReady, hasTimedOut]);

  useEffect(() => {
    if (isBypassed || isReady || hasTimedOut) return;

    if (mountTimestampRef.current === null) {
      mountTimestampRef.current = Date.now();
    }

    const initialTimer = window.setTimeout(() => {
      void pingServer();
    }, 0);

    const pollInterval = window.setInterval(() => {
      void pingServer();
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollInterval);
    };
  }, [isBypassed, isReady, hasTimedOut, pingServer]);

  useEffect(() => {
    if (isBypassed || !showWelcome) return;

    const welcomeTimer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 1200);

    return () => window.clearTimeout(welcomeTimer);
  }, [isBypassed, showWelcome]);

  if (isBypassed || (isReady && !showWelcome)) {
    return <>{children}</>;
  }

  if (hasTimedOut) {
    return (
      <>
        {children}
        <div className={styles.overlay} role='dialog' aria-modal='true'>
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <div className={`${styles.iconWrapper} ${styles.warningIconWrapper}`}>
                <AlertTriangle size={28} />
              </div>
              <div className={styles.titleGroup}>
                <span className={styles.tagline} style={{ color: '#dc2626' }}>
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
                <CheckCircle2 size={28} />
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
              <Cpu size={28} />
            </div>
            <div className={styles.titleGroup}>
              <span className={styles.tagline}>Infrastructure Cold-Start</span>
              <h3 className={styles.title}>Warming Up Services</h3>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            {isTakingLonger ? (
              <div className={styles.delayedAlertBox}>
                <div className={styles.alertIconPulse}>
                  <AlertCircle size={20} />
                </div>
                <div className={styles.alertTextGroup}>
                  <span className={styles.alertTitle}>Taking longer than usual</span>
                  <p className={styles.alertDesc}>
                    The Render free-tier server is waking up from deep sleep. Please hold
                    tight...
                  </p>
                </div>
              </div>
            ) : (
              <p className={styles.descText}>
                <strong>Please wait 20 to 30 seconds.</strong> The backend hosted on{' '}
                <strong>Render</strong> spins down after inactivity and is now
                reconnecting to <strong>Neon DB</strong>.
              </p>
            )}

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
