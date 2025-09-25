import React from 'react';
import { useTheme } from '../lib/theme.jsx';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const icon = theme === 'dark' ? (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
  );

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button type="button" aria-label={label} onClick={toggleTheme} className="theme-toggle inline-flex items-center gap-2 px-4 py-3 min-h-[44px] text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
      {icon}
      <span>{label}</span>
    </button>
  );
}