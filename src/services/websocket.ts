import { WebSocketMessage } from '../types/websocket';
import { mockUsers } from '../data/mockUsers';

class MockWebSocketService {
  private listeners: Set<(message: WebSocketMessage) => void> = new Set();
  private connected = false;
  private messageInterval?: number;

  connect() {
    if (this.connected) return;
    
    this.connected = true;
    console.log('🔌 WebSocket connected (mock)');
    
    // Start sending mock messages
    this.startMockMessages();
    
    // Simulate connection established
    setTimeout(() => {
      this.notifyListeners({
        id: Date.now().toString(),
        type: 'notification',
        timestamp: Date.now(),
        userId: 'system',
        userName: 'System',
        userAvatar: '',
        data: {
          title: 'Connected',
          message: 'Real-time features are now active',
          priority: 'low' as const
        }
      });
    }, 1000);
  }

  disconnect() {
    this.connected = false;
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    console.log('🔌 WebSocket disconnected (mock)');
  }

  sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>) {
    const fullMessage: WebSocketMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    // Simulate network delay
    setTimeout(() => {
      this.notifyListeners(fullMessage);
    }, 100 + Math.random() * 500);
  }

  onMessage(callback: (message: WebSocketMessage) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(message: WebSocketMessage) {
    this.listeners.forEach(callback => callback(message));
  }

  private startMockMessages() {
    // Send periodic mock activity
    this.messageInterval = setInterval(() => {
      if (!this.connected) return;
      
      const mockActivities = [
        {
          type: 'activity' as const,
          action: 'completed',
          target: 'Sprint Planning',
          description: 'finished sprint planning for Q4'
        },
        {
          type: 'activity' as const,
          action: 'joined',
          target: 'Engineering Team',
          description: 'joined the engineering team meeting'
        },
        {
          type: 'activity' as const,
          action: 'uploaded',
          target: 'Design Assets',
          description: 'uploaded new design assets'
        },
        {
          type: 'chat' as const,
          message: 'Great work on the new feature! 🎉',
          channel: 'general'
        },
        {
          type: 'kudos' as const,
          recipient: 'Alex Chen',
          message: 'Outstanding code review!',
          badge: 'Code Reviewer'
        }
      ];

      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

      this.sendMessage({
        type: randomActivity.type,
        userId: randomUser.id,
        userName: randomUser.name,
        userAvatar: randomUser.avatar,
        data: randomActivity.type === 'activity' ? {
          action: randomActivity.action,
          target: randomActivity.target,
          description: randomActivity.description
        } : randomActivity.type === 'chat' ? {
          message: randomActivity.message,
          channel: randomActivity.channel
        } : {
          recipient: randomActivity.recipient,
          message: randomActivity.message,
          badge: randomActivity.badge
        }
      });
    }, 15000 + Math.random() * 15000); // Random interval between 15-30 seconds
  }
}

export const websocketService = new MockWebSocketService();