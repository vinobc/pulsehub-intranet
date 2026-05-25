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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">
          🎮
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Gamification</h3>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'achievements' | 'leaderboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  )
}
