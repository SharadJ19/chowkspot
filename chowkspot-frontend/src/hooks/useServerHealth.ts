import { useState, useEffect } from 'react';
import type { HealthCheckResponse } from '@/types';

// Pull the base backend URL from Vite environment variables, stripping any trailing /api if present
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');

export const useServerHealth = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: number;
    if (isLoading) {
      timer = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        // Direct fetch request to the root /health endpoint (bypassing /api prefix)
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data: HealthCheckResponse = await response.json();

        if (response.ok && data?.status === 'healthy' && isMounted) {
          setIsReady(true);
          setIsLoading(false);
        } else {
          throw new Error('Server not ready yet');
        }
      } catch {
        if (isMounted) {
          // Poll again after 4 seconds until Render spins up
          setTimeout(checkHealth, 4000);
        }
      }
    };

    void checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isReady, isLoading, elapsedSeconds };
};
