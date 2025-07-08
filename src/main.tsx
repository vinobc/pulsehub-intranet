import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize theme immediately to prevent flash
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      const theme = parsed?.state?.theme || 'system';
      const actualTheme = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(actualTheme);
      document.documentElement.setAttribute('data-theme', actualTheme);
      console.log('Initial theme applied:', actualTheme);
    } catch {
      // Fallback to light theme
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } else {
    // Default to system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(systemTheme);
    document.documentElement.setAttribute('data-theme', systemTheme);
    console.log('Default theme applied:', systemTheme);
  }
};

initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
