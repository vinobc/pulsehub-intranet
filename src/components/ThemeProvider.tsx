import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, actualTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Force apply theme on mount and when it changes
    console.log('ThemeProvider: Applying theme', theme, 'actual:', actualTheme);
    setTheme(theme);
  }, [theme, setTheme, actualTheme]);

  useEffect(() => {
    // Ensure theme is applied to document immediately
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
      root.setAttribute('data-theme', actualTheme);
      console.log('ThemeProvider: Document updated with theme', actualTheme);
    }
  }, [actualTheme]);

  return <>{children}</>;
};