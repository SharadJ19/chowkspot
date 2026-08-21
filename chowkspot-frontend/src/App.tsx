import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/context/AuthProvider';
import { SocketProvider } from '@/context/SocketProvider';
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

          <Toaster
            theme='light'
            position='bottom-right'
            closeButton
            richColors={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: 'var(--color-slate-900)',
                border: '1px solid var(--color-border)',
                borderLeft: '5px solid var(--color-primary-500)',
                borderRadius: 'var(--radius-xl)',
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-sans)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                minWidth: '340px',
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
