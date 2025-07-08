import { useEffect } from 'react';
import { useWebSocketStore } from '../stores/websocketStore';
import { useAuthStore } from '../stores/authStore';

export const ActivityFeed = () => {
  const { messages, connected, connect } = useWebSocketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!connected) {
      connect();
    }
  }, [connected, connect]);

  const activityMessages = messages.filter(msg => msg.type === 'activity');
  const recentMessages = activityMessages.slice(-10).reverse();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Activity</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentMessages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No recent activity. Activity will appear here in real-time.
          </p>
        ) : (
          recentMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors">
              <img
                src={message.userAvatar}
                alt={message.userName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {message.userName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{(message.data as { action?: string }).action}</span>
                  {(message.data as { target?: string }).target && (
                    <>
                      {' '}
                      <span className="font-medium text-gray-900 dark:text-white">{(message.data as { target?: string }).target}</span>
                    </>
                  )}
                  {' - '}
                  {(message.data as { description?: string }).description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => {
              useWebSocketStore.getState().sendMessage({
                type: 'activity',
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                data: {
                  action: 'viewed',
                  target: 'Activity Feed',
                  description: 'checked the latest team activity'
                }
              });
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            📝 Add your activity
          </button>
        </div>
      )}
    </div>
  );
};