import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: getActualTheme('system'),
      
      setTheme: (theme: Theme) => {
        const actualTheme = getActualTheme(theme);
        set({ theme, actualTheme });
        
        // Apply theme to document immediately
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(actualTheme);
          
          // Also set data attribute for debugging
          root.setAttribute('data-theme', actualTheme);
          console.log('Theme applied:', actualTheme, 'Classes:', root.classList.toString());
        }
      },
      
      toggleTheme: () => {
        const { actualTheme } = get();
        const newTheme = actualTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme immediately on hydration
          const actualTheme = getActualTheme(state.theme);
          state.actualTheme = actualTheme;
          
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(actualTheme);
          }
        }
      }
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      store.setTheme('system'); // This will update the actual theme
    }
  });
}