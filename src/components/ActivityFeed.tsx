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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">
            🔔
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Team Activity</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {recentMessages.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">📡</div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Activity will appear here in real-time</p>
          </div>
        ) : (
          recentMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors group">
              <img
                src={message.userAvatar}
                alt={message.userName}
                className="w-8 h-8 rounded-lg flex-shrink-0 object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {message.userName}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{(message.data as { action?: string }).action}</span>
                  {(message.data as { target?: string }).target && (
                    <>
                      {' '}
                      <span className="font-medium text-gray-800 dark:text-gray-200">{(message.data as { target?: string }).target}</span>
                    </>
                  )}
                  {' - '}
                  <span className="text-gray-500 dark:text-gray-400">{(message.data as { description?: string }).description}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
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
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>📝</span> Add your activity
          </button>
        </div>
      )}
    </div>
  );
};
