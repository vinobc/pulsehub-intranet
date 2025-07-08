import { useState } from 'react'
import { useGamificationStore } from '../stores/gamificationStore'

export function Achievements() {
  const { achievements, unlockAchievement, userPoints, userLevel, getNextLevelProgress } = useGamificationStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'productivity', label: 'Productivity', icon: '📈' },
    { id: 'collaboration', label: 'Collaboration', icon: '👥' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'milestone', label: 'Milestones', icon: '🎯' }
  ]

  const filteredAchievements = selectedCategory && selectedCategory !== 'all'
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progress = getNextLevelProgress()

  const handleTestUnlock = (achievementId: string) => {
    unlockAchievement(achievementId)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {unlockedCount}/{totalCount} unlocked
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userLevel}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Level {userLevel}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{userPoints} points</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id || (!selectedCategory && category.id === 'all')
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border rounded-lg p-4 transition-all duration-300 ${
              achievement.unlocked
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${
                    achievement.unlocked ? 'text-green-800 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${
                  achievement.unlocked ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.points} points
                  </span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {!achievement.unlocked && (
                  <button
                    onClick={() => handleTestUnlock(achievement.id)}
                    className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Test Unlock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">🏆</div>
          <p className="text-gray-500 dark:text-gray-400">No achievements in this category yet.</p>
        </div>
      )}
    </div>
  )
}