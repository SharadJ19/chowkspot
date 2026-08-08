import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { AppRouter } from '@/routes';
import { ServerWarmingBanner } from '@/components/ui/ServerWarmingBanner/ServerWarmingBanner';
import '@/styles/index.css';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <ServerWarmingBanner>
              <AppRouter />
            </ServerWarmingBanner>
          </BrowserRouter>
          {/* Prominent, Prominently Sized Toast Container using Existing Design Tokens */}
          <Toaster
            position='bottom-right'
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--color-slate-900)',
                color: 'var(--color-slate-50)',
                border: '1px solid var(--color-slate-700)',
                borderLeft: '6px solid var(--color-primary-500)',
                borderRadius: 'var(--radius-2xl)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-sans)',
                boxShadow: 'var(--shadow-xl)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                minWidth: '360px',
                minHeight: '64px',
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
