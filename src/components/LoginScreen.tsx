import { useAuthStore } from '../stores/authStore';
import { User } from '../types/user';

export const LoginScreen = () => {
  const { login, isLoading } = useAuthStore();

  const handleLogin = (role: User['role']) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">PulseHub</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Choose your persona to explore the intranet</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('manager')}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face"
                alt="Manager"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah Johnson</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manager - Engineering</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Team leadership, analytics, strategic overview</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleLogin('employee')}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                alt="Employee"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alex Chen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee - Engineering</p>
                <p className="text-xs text-green-600 dark:text-green-400">Task focus, collaboration, skill development</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleLogin('new_hire')}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                alt="New Hire"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jordan Smith</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Hire - Marketing</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Onboarding, learning, getting started</p>
              </div>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Logging in...</p>
          </div>
        )}
      </div>
    </div>
  );
};