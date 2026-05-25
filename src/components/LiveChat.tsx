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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 h-96 flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">
            💬
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Live Chat</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">#general</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => useWebSocketStore.getState().clearMessages()}
            className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scroll-smooth pr-1">
        {recentChatMessages.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Start a conversation!</p>
          </div>
        ) : (
          recentChatMessages.map((msg) => {
            const isOwnMessage = msg.userId === user?.id;
            return (
              <div key={msg.id} className={`flex items-start gap-2.5 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.userAvatar}
                  alt={msg.userName}
                  className="w-7 h-7 rounded-lg flex-shrink-0 object-cover shadow-sm"
                />
                <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${isOwnMessage ? 'justify-end' : ''}`}>
                    <span className="font-medium text-gray-900 dark:text-white text-xs">
                      {msg.userName}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white rounded-tr-md' 
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-tl-md'
                  }`}>
                    {(msg.data as { message?: string }).message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all"
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!message.trim() || !connected}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-600/25 hover:shadow-md hover:shadow-blue-600/25 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};
