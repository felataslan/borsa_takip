'use client';

import { PaletteMode, ThemeOptions } from '@mui/material';

export const getTheme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#22c55e', // text-green-500
    },
    background: {
      default: mode === 'dark' ? '#000000' : '#f9fafb', // bg-black vs bg-gray-50
      paper: mode === 'dark' ? '#111827' : '#ffffff', // bg-gray-900 vs bg-white
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#111827', // text-white vs text-gray-900
      secondary: mode === 'dark' ? '#9ca3af' : '#6b7280', // text-gray-400 vs text-gray-500
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(3, 7, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(31, 41, 55, 1)' : 'rgba(229, 231, 235, 1)'}`,
        },
      },
    },
  },
});
