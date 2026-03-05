'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/chat';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/auth-store';

interface SocketContextType {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const SOCKET_URL = API_URL.replace('/api', '');

        if (!socketRef.current && isAuthenticated) {
            socketRef.current = io(`${SOCKET_URL}/chat`, {
                withCredentials: true,
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                console.log('✅ Socket connected');
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
                console.log('❌ Socket disconnected');
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('⚠️ Socket connection error:', err.message);
            });

            // Global listener for new messages
            socketRef.current.on('new_message', (message) => {
                const { addMessage } = useChatStore.getState();
                addMessage(message.chatRoomId, message);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
