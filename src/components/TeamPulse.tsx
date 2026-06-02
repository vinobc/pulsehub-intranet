import { useState, useEffect } from 'react'

interface PulseEntry {
  id: string
  userId: string
  userName: string
  userAvatar: string
  mood: string
  moodLabel: string
  note: string
  timestamp: number
}

const moods = [
  { emoji: '🔥', label: 'On Fire', color: 'bg-orange-100 dark:bg-orange-900/20 ring-orange-400', textColor: 'text-orange-600 dark:text-orange-400', barColor: 'bg-orange-500' },
  { emoji: '😊', label: 'Great', color: 'bg-emerald-100 dark:bg-emerald-900/20 ring-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500' },
  { emoji: '😌', label: 'Okay', color: 'bg-blue-100 dark:bg-blue-900/20 ring-blue-400', textColor: 'text-blue-600 dark:text-blue-400', barColor: 'bg-blue-500' },
  { emoji: '😐', label: 'Meh', color: 'bg-amber-100 dark:bg-amber-900/20 ring-amber-400', textColor: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500' },
  { emoji: '😩', label: 'Struggling', color: 'bg-rose-100 dark:bg-rose-900/20 ring-rose-400', textColor: 'text-rose-600 dark:text-rose-400', barColor: 'bg-rose-500' },
]

// Simulated team pulse data
const generateTeamData = (): PulseEntry[] => [
  { id: '1', userId: 'u1', userName: 'Alex Chen', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', mood: '🔥', moodLabel: 'On Fire', note: 'Shipped the new feature!', timestamp: Date.now() - 3600000 },
  { id: '2', userId: 'u2', userName: 'Maria Garcia', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', mood: '😊', moodLabel: 'Great', note: 'Great team standup today', timestamp: Date.now() - 7200000 },
  { id: '3', userId: 'u3', userName: 'James Wilson', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face', mood: '😌', moodLabel: 'Okay', note: '', timestamp: Date.now() - 10800000 },
  { id: '4', userId: 'u4', userName: 'Priya Patel', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face', mood: '😊', moodLabel: 'Great', note: 'Sprint goals on track', timestamp: Date.now() - 14400000 },
  { id: '5', userId: 'u5', userName: 'Tom Anderson', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face', mood: '😐', moodLabel: 'Meh', note: 'Blocked on dependencies', timestamp: Date.now() - 18000000 },
]

export function TeamPulse() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [teamEntries, setTeamEntries] = useState<PulseEntry[]>([])
  const [showRecent, setShowRecent] = useState(false)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setTeamEntries(generateTeamData())
    setTimeout(() => setAnimated(true), 300)
  }, [])

  const handleSubmit = () => {
    if (!selectedMood) return
    const moodData = moods.find(m => m.emoji === selectedMood)
    const newEntry: PulseEntry = {
      id: 'self',
      userId: 'self',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face',
      mood: selectedMood,
      moodLabel: moodData?.label ?? '',
      note,
      timestamp: Date.now(),
    }
    setTeamEntries(prev => [newEntry, ...prev])
    setSubmitted(true)
  }

  // Calculate mood distribution
  const allEntries = teamEntries
  const moodCounts = moods.map(m => ({
    ...m,
    count: allEntries.filter(e => e.mood === m.emoji).length
  }))
  const totalResponses = allEntries.length
  const avgMoodIndex = totalResponses > 0
    ? allEntries.reduce((sum, e) => sum + moods.findIndex(m => m.emoji === e.mood), 0) / totalResponses
    : 2
  const dominantMood = moods[Math.round(avgMoodIndex)]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-lg">
            💓
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Team Pulse</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">How's the team feeling today?</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-full">
          {totalResponses} checked in
        </span>
      </div>

      {/* Mood overview bar */}
      <div className="mb-5">
        <div className="flex rounded-full overflow-hidden h-3 bg-gray-100 dark:bg-gray-700">
          {moodCounts.filter(m => m.count > 0).map((m, i) => (
            <div
              key={m.emoji}
              className={`${m.barColor} transition-all duration-1000 ease-out`}
              style={{ width: animated ? `${(m.count / totalResponses) * 100}%` : '0%', transitionDelay: `${i * 100}ms` }}
              title={`${m.label}: ${m.count}`}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {moodCounts.map(m => (
            <div key={m.emoji} className="flex flex-col items-center gap-0.5">
              <span className="text-sm">{m.emoji}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{m.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team mood summary */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 mb-5">
        <span className="text-2xl">{dominantMood?.emoji}</span>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Team is feeling <span className={dominantMood?.textColor}>{dominantMood?.label.toLowerCase()}</span></p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Based on {totalResponses} check-ins today</p>
        </div>
      </div>

      {/* Your mood selector */}
      {!submitted ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">How are you feeling?</p>
          <div className="flex gap-2">
            {moods.map(m => (
              <button
                key={m.emoji}
                onClick={() => setSelectedMood(m.emoji)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200 ${
                  selectedMood === m.emoji
                    ? `${m.color} ring-2 scale-105`
                    : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`text-2xl transition-transform duration-200 ${selectedMood === m.emoji ? 'scale-110' : ''}`}>{m.emoji}</span>
                <span className={`text-[10px] font-medium ${selectedMood === m.emoji ? m.textColor : 'text-gray-500 dark:text-gray-400'}`}>{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="space-y-2 animate-fadeIn">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)..."
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/25 active:scale-[0.98]"
              >
                Share my pulse
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">{selectedMood}</div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Pulse shared!</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Your team can see how you're doing</p>
        </div>
      )}

      {/* Recent check-ins */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="flex items-center justify-between w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span className="font-medium">Recent check-ins</span>
          <svg className={`w-4 h-4 transition-transform duration-200 ${showRecent ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showRecent && (
          <div className="mt-3 space-y-2">
            {teamEntries.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <img src={entry.userAvatar} alt={entry.userName} className="w-7 h-7 rounded-lg object-cover" />
                <span className="text-lg">{entry.mood}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.userName}</span>
                  {entry.note && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">— {entry.note}</span>}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                  {Math.round((Date.now() - entry.timestamp) / 3600000)}h ago
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
