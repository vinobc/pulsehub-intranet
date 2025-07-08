import { useState } from 'react'
import { Achievements } from './Achievements'
import { Leaderboard } from './Leaderboard'

export function GamificationDashboard() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements')

  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '👑' }
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'achievements' | 'leaderboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  )
}