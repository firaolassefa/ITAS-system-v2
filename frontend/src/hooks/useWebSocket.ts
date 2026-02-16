import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useWebSocket(url: string, options: {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
} = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = localStorage.getItem('itas_token');
    const wsUrl = token ? `${url}?token=${token}` : url;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setReconnectAttempt(0);
      options.onOpen?.();
    };

    ws.onclose = () => {
      setIsConnected(false);
      options.onClose?.();
      
      // Attempt reconnect
      if (options.autoConnect !== false && 
          (options.maxReconnectAttempts === undefined || 
           reconnectAttempt < (options.maxReconnectAttempts - 1))) {
        
        const interval = options.reconnectInterval || 3000;
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempt(prev => prev + 1);
          connect();
        }, interval);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      options.onError?.(error);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        options.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }, [url, options, reconnectAttempt]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setIsConnected(false);
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect]);

  return {
    isConnected,
    lastMessage,
    reconnectAttempt,
    connect,
    disconnect,
    send,
  };
}