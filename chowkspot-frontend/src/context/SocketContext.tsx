import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { SocketContext } from './socketContext';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Derive initial socket state safely instead of setting inside effect body
  const activeSocket = isAuthenticated ? getSocket() : null;
  const [socket, setSocket] = useState<Socket | null>(activeSocket);
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

    currentSocket.on('connect', onConnect);
    currentSocket.on('disconnect', onDisconnect);

    return () => {
      currentSocket.off('connect', onConnect);
      currentSocket.off('disconnect', onDisconnect);
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
