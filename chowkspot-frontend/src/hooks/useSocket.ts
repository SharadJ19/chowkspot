// Hook to listen for realtime backend events

import { useContext, useEffect } from 'react';
import { SocketContext } from '@/context/socketContext';

export const useSocket = (eventName?: string, callback?: (data: unknown) => void) => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  const { socket, isConnected } = context;

  useEffect(() => {
    if (!socket || !eventName || !callback) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);

  return { socket, isConnected };
};
