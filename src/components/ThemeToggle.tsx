import { useThemeStore } from '../stores/themeStore';

export const ThemeToggle = () => {
  const { theme, actualTheme, setTheme } = useThemeStore();

  const themes = [
    { key: 'light' as const, label: 'Light', icon: '☀️' },
    { key: 'dark' as const, label: 'Dark', icon: '🌙' },
    { key: 'system' as const, label: 'System', icon: '💻' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {themes.map((themeOption) => (
          <button
            key={themeOption.key}
            onClick={() => {
              console.log('Theme button clicked:', themeOption.key);
              setTheme(themeOption.key);
            }}
            className={`
              px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${theme === themeOption.key 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title={`Switch to ${themeOption.label.toLowerCase()} theme`}
          >
            <span className="mr-1">{themeOption.icon}</span>
            {themeOption.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {actualTheme === 'dark' ? '🌙' : '☀️'}
      </div>
    </div>
  );
};