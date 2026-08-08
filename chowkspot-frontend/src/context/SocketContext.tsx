import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { SocketContext } from './socketContext';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const activeSocket = isAuthenticated ? getSocket() : null;
  const [socket, _setSocket] = useState<Socket | null>(activeSocket);
  const [isConnected, setIsConnected] = useState<boolean>(
    activeSocket?.connected ?? false,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const currentSocket = getSocket();
    if (!currentSocket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // ⚡ Real-time Socket Toast Listeners
    const onNewBookingRequest = (payload: {
      bookingId: string;
      requestedDate: string;
    }) => {
      toast.success('🎉 New Booking Request Received!', {
        description:
          'A customer submitted a new service request. Check "My Bookings" to respond.',
      });
    };

    const onBookingStatusUpdated = (payload: { bookingId: string; status: string }) => {
      toast.info(`📋 Booking Status Updated: ${payload.status.replace('_', ' ')}`, {
        description: 'The status of one of your service bookings has changed.',
      });
    };

    currentSocket.on('connect', onConnect);
    currentSocket.on('disconnect', onDisconnect);
    currentSocket.on('NEW_BOOKING_REQUEST', onNewBookingRequest);
    currentSocket.on('BOOKING_STATUS_UPDATED', onBookingStatusUpdated);

    return () => {
      currentSocket.off('connect', onConnect);
      currentSocket.off('disconnect', onDisconnect);
      currentSocket.off('NEW_BOOKING_REQUEST', onNewBookingRequest);
      currentSocket.off('BOOKING_STATUS_UPDATED', onBookingStatusUpdated);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket: isAuthenticated ? socket : null,
        isConnected: isAuthenticated ? isConnected : false,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
