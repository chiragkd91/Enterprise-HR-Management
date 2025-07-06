/**
 * Real-time Data Hook - Manages WebSocket connections and real-time updates
 * Provides live data synchronization with Flask backend
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ENV_CONFIG } from '@/config/env';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseRealTimeDataOptions {
  endpoint: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface UseRealTimeDataReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook for real-time data management
 */
export function useRealTimeData(options: UseRealTimeDataOptions): UseRealTimeDataReturn {
  const {
    endpoint,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    // Get auth token for WebSocket connection
    const token = localStorage.getItem('authToken');
    const wsUrl = `${endpoint}${token ? `?token=${token}` : ''}`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        onConnect?.();
        
        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onDisconnect?.();

        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          setConnectionStatus('error');
          toast.error('Failed to maintain real-time connection');
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus('error');
        onError?.(error);
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [endpoint, maxReconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError, onMessage]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  /**
   * Send message through WebSocket
   */
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Connect on mount and cleanup on unmount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
}

/**
 * Hook for real-time notifications
 */
export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { lastMessage, isConnected } = useRealTimeData({
    endpoint: `${ENV_CONFIG.WS_BASE_URL}/ws/notifications`,
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications(prev => [message.data, ...prev.slice(0, 49)]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast for high priority notifications
        if (message.data.priority === 'high') {
          toast.info(message.data.title, {
            description: message.data.message,
          });
        }
      }
    }
  });

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead
  };
}

/**
 * Hook for real-time attendance tracking
 */
export function useRealTimeAttendance() {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<'clocked-in' | 'clocked-out'>('clocked-out');

  const { sendMessage, isConnected } = useRealTimeData({
    endpoint: `${ENV_CONFIG.WS_BASE_URL}/ws/attendance`,
    onMessage: (message) => {
      if (message.type === 'attendance_update') {
        setAttendanceData(message.data);
        setCurrentStatus(message.data.status);
      }
    }
  });

  const clockIn = useCallback((location?: string) => {
    sendMessage({
      type: 'clock_in',
      location: location || 'Office',
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const clockOut = useCallback(() => {
    sendMessage({
      type: 'clock_out',
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  return {
    attendanceData,
    currentStatus,
    isConnected,
    clockIn,
    clockOut
  };
}

/**
 * Hook for real-time dashboard updates
 */
export function useRealTimeDashboard() {
  const [dashboardData, setDashboardData] = useState<any>({});

  const { lastMessage, isConnected } = useRealTimeData({
    endpoint: `${ENV_CONFIG.WS_BASE_URL}/ws/dashboard`,
    onMessage: (message) => {
      if (message.type === 'dashboard_update') {
        setDashboardData(prev => ({
          ...prev,
          [message.data.widget]: message.data.value
        }));
      }
    }
  });

  return {
    dashboardData,
    isConnected,
    lastUpdate: lastMessage?.timestamp
  };
}

/**
 * Hook for real-time chat/messaging
 */
export function useRealTimeChat(channelId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const { sendMessage, isConnected } = useRealTimeData({
    endpoint: `${ENV_CONFIG.WS_BASE_URL}/ws/chat/${channelId}`,
    onMessage: (message) => {
      switch (message.type) {
        case 'message':
          setMessages(prev => [...prev, message.data]);
          break;
        case 'typing_start':
          setTypingUsers(prev => [...new Set([...prev, message.data.user])]);
          break;
        case 'typing_stop':
          setTypingUsers(prev => prev.filter(user => user !== message.data.user));
          break;
      }
    }
  });

  const sendChatMessage = useCallback((content: string) => {
    sendMessage({
      type: 'message',
      content,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const startTyping = useCallback(() => {
    sendMessage({ type: 'typing_start' });
  }, [sendMessage]);

  const stopTyping = useCallback(() => {
    sendMessage({ type: 'typing_stop' });
  }, [sendMessage]);

  return {
    messages,
    typingUsers,
    isConnected,
    sendMessage: sendChatMessage,
    startTyping,
    stopTyping
  };
}
