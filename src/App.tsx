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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PulseHub</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block w-96">
                  <SmartSearch />
                </div>
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {user?.role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {user?.role === 'manager' && 'Here\'s your team overview and management dashboard'}
              {user?.role === 'employee' && 'Your personalized workspace is ready'}
              {user?.role === 'new_hire' && 'Welcome to PulseHub! Let\'s get you started'}
            </p>
            
            <Dashboard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <ActivityFeed />
              <LiveChat />
            </div>
            
            <div className="mt-8">
              <GamificationDashboard />
            </div>
          </div>
        </main>
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
