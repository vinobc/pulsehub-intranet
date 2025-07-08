import { useState, useEffect, useRef } from 'react';
import { useWebSocketStore } from '../stores/websocketStore';
import { useAuthStore } from '../stores/authStore';

export const LiveChat = () => {
  const [message, setMessage] = useState('');
  const { messages, connected, connect, sendMessage } = useWebSocketStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connected) {
      connect();
    }
  }, [connected, connect]);

  useEffect(() => {
    // Only auto-scroll if user is near the bottom
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      const isNearBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 50;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const chatMessages = messages.filter(msg => msg.type === 'chat');
  const recentChatMessages = chatMessages.slice(-20);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    sendMessage({
      type: 'chat',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      data: {
        message: message.trim(),
        channel: 'general'
      }
    });

    setMessage('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-96 flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Chat</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => useWebSocketStore.getState().clearMessages()}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded"
          >
            Clear
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scroll-smooth">
        {recentChatMessages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No messages yet. Start a conversation!
          </p>
        ) : (
          recentChatMessages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <img
                src={msg.userAvatar}
                alt={msg.userName}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {msg.userName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {(msg.data as { message?: string }).message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!message.trim() || !connected}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};