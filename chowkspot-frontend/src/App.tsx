import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
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
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
