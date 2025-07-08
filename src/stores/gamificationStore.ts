import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedAt?: Date
  category: 'productivity' | 'collaboration' | 'learning' | 'milestone'
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatar: string
  points: number
  level: number
  badges: string[]
  rank: number
}

interface GamificationState {
  achievements: Achievement[]
  leaderboard: LeaderboardEntry[]
  userPoints: number
  userLevel: number
  userBadges: string[]
  unlockedAchievements: string[]
  
  unlockAchievement: (achievementId: string) => void
  addPoints: (points: number) => void
  updateLeaderboard: (entries: LeaderboardEntry[]) => void
  checkLevelUp: () => boolean
  getNextLevelProgress: () => number
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-login',
    title: 'Welcome Aboard!',
    description: 'Complete your first login',
    icon: '🎉',
    points: 10,
    unlocked: false,
    category: 'milestone'
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '✅',
    points: 50,
    unlocked: false,
    category: 'productivity'
  },
  {
    id: 'voice-commander',
    title: 'Voice Commander',
    description: 'Use voice commands 5 times',
    icon: '🎤',
    points: 30,
    unlocked: false,
    category: 'learning'
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Send 10 kudos to teammates',
    icon: '👥',
    points: 40,
    unlocked: false,
    category: 'collaboration'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Login before 8 AM',
    icon: '🌅',
    points: 20,
    unlocked: false,
    category: 'productivity'
  },
  {
    id: 'streak-week',
    title: 'Week Streak',
    description: 'Login 7 days in a row',
    icon: '🔥',
    points: 100,
    unlocked: false,
    category: 'milestone'
  },
  {
    id: 'dashboard-master',
    title: 'Dashboard Master',
    description: 'Customize your dashboard layout',
    icon: '🎛️',
    points: 25,
    unlocked: false,
    category: 'learning'
  },
  {
    id: 'communicator',
    title: 'Great Communicator',
    description: 'Send 50 chat messages',
    icon: '💬',
    points: 60,
    unlocked: false,
    category: 'collaboration'
  }
]

const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9671e8e?w=150',
    points: 1250,
    level: 8,
    badges: ['🏆', '🎯', '💎'],
    rank: 1
  },
  {
    userId: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    points: 1100,
    level: 7,
    badges: ['🚀', '⭐', '🎪'],
    rank: 2
  },
  {
    userId: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    points: 980,
    level: 6,
    badges: ['🌟', '💪', '🎨'],
    rank: 3
  },
  {
    userId: '4',
    name: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    points: 850,
    level: 5,
    badges: ['🏅', '🎯'],
    rank: 4
  },
  {
    userId: '5',
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    points: 720,
    level: 4,
    badges: ['⚡', '🌈'],
    rank: 5
  }
]

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      leaderboard: mockLeaderboard,
      userPoints: 0,
      userLevel: 1,
      userBadges: [],
      unlockedAchievements: [],

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const achievement = state.achievements.find(a => a.id === achievementId)
          if (!achievement || state.unlockedAchievements.includes(achievementId)) {
            return state
          }

          return {
            ...state,
            achievements: state.achievements.map(a => 
              a.id === achievementId 
                ? { ...a, unlocked: true, unlockedAt: new Date() }
                : a
            ),
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            userPoints: state.userPoints + achievement.points,
            userBadges: [...state.userBadges, achievement.icon]
          }
        })
      },

      addPoints: (points: number) => {
        set((state) => ({
          ...state,
          userPoints: state.userPoints + points
        }))
      },

      updateLeaderboard: (entries: LeaderboardEntry[]) => {
        set((state) => ({
          ...state,
          leaderboard: entries
        }))
      },

      checkLevelUp: () => {
        const { userPoints, userLevel } = get()
        const pointsForNextLevel = userLevel * 100
        
        if (userPoints >= pointsForNextLevel) {
          set((state) => ({
            ...state,
            userLevel: state.userLevel + 1
          }))
          return true
        }
        return false
      },

      getNextLevelProgress: () => {
        const { userPoints, userLevel } = get()
        const pointsForCurrentLevel = (userLevel - 1) * 100
        const pointsForNextLevel = userLevel * 100
        const progress = (userPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)
        return Math.max(0, Math.min(1, progress))
      }
    }),
    {
      name: 'gamification-storage'
    }
  )
)