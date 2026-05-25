import { useAuthStore } from './stores/authStore'
import { LoginScreen } from './components/LoginScreen'
import { ActivityFeed } from './components/ActivityFeed'
import { LiveChat } from './components/LiveChat'
import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import { Dashboard } from './components/Dashboard'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { GamificationDashboard } from './components/GamificationDashboard'
import { SmartSearch } from './components/SmartSearch'
import './App.css'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginScreen />
      </ThemeProvider>
    )
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/25">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">PulseHub</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block w-80">
                  <SmartSearch />
                </div>
                <ThemeToggle />
                <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-lg object-cover shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome banner */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0yOVYySDI0djFoMTB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
            <div className="relative z-10">
              <p className="text-blue-100 text-sm mb-1">{greeting()}</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {user?.name} 👋
              </h2>
              <p className="text-blue-100/80 text-sm max-w-lg">
                {user?.role === 'manager' && 'Here\'s your team overview and management dashboard. Stay on top of everything.'}
                {user?.role === 'employee' && 'Your personalized workspace is ready. Let\'s make today productive.'}
                {user?.role === 'new_hire' && 'Welcome to PulseHub! Let\'s get you started on your onboarding journey.'}
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-12 -right-4 w-48 h-48 bg-white/5 rounded-full"></div>
          </div>

          <Dashboard />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <ActivityFeed />
            <LiveChat />
          </div>

          <div className="mt-8">
            <GamificationDashboard />
          </div>
        </main>
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
