export interface WebSocketMessage {
  id: string;
  type: 'activity' | 'chat' | 'kudos' | 'notification';
  timestamp: number;
  userId: string;
  userName: string;
  userAvatar: string;
  data: unknown;
}

export interface ActivityMessage extends WebSocketMessage {
  type: 'activity';
  data: {
    action: string;
    target?: string;
    description: string;
  };
}

export interface ChatMessage extends WebSocketMessage {
  type: 'chat';
  data: {
    message: string;
    channel: string;
  };
}

export interface KudosMessage extends WebSocketMessage {
  type: 'kudos';
  data: {
    recipient: string;
    message: string;
    badge?: string;
  };
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  };
}