'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We disable the set-state-in-effect rule here because this is the standard Next.js
    // workaround to avoid hydration mismatches (two-pass rendering).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Check local storage on mount
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    } else {
      // Default to dark or check system pref
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Sync with Tailwind class on HTML doc
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('themeMode', mode);
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Prevent hydration mismatch flash by holding off render until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden', minHeight: '100vh', backgroundColor: 'transparent' }}>{children}</div>;
  }

  const muiTheme = createTheme(getTheme(mode));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
