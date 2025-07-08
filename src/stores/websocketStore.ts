import { create } from 'zustand';
import { WebSocketMessage } from '../types/websocket';
import { websocketService } from '../services/websocket';

interface WebSocketStore {
  messages: WebSocketMessage[];
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: Omit<WebSocketMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  messages: [],
  connected: false,

  connect: () => {
    websocketService.connect();
    set({ connected: true });

    // Listen for messages
    websocketService.onMessage((message) => {
      set((state) => ({
        messages: [...state.messages.slice(-49), message] // Keep last 50 messages
      }));
    });
  },

  disconnect: () => {
    websocketService.disconnect();
    set({ connected: false });
  },

  sendMessage: (message) => {
    websocketService.sendMessage(message);
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));