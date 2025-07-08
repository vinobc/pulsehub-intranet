import { useGamificationStore } from '../stores/gamificationStore'
import { useAuthStore } from '../stores/authStore'

export function Leaderboard() {
  const { leaderboard } = useGamificationStore()
  const { user } = useAuthStore()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 dark:text-yellow-400'
      case 2: return 'text-gray-600 dark:text-gray-400'
      case 3: return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          This week
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
              entry.userId === user?.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-900/40'
            }`}
          >
            <div className={`text-xl font-bold ${getRankColor(entry.rank)} min-w-[3rem] text-center`}>
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-shrink-0">
              <img
                src={entry.avatar}
                alt={entry.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </h3>
                {entry.userId === user?.id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Level {entry.level}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.points.toLocaleString()} points
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                <span key={badgeIndex} className="text-lg">
                  {badge}
                </span>
              ))}
              {entry.badges.length > 3 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  +{entry.badges.length - 3}
                </span>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {entry.points.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                points
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Want to climb higher?
          </span>
          <div className="flex space-x-2">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View Tips
            </button>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              All Time
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}