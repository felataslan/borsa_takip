'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22c55e', // text-green-500 from Tailwind
    },
    background: {
      default: '#000000', // bg-black from Tailwind
      paper: '#111827', // dark gray card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af', // text-gray-400
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(3, 7, 18, 0.8)', // bg-gray-950/80
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(31, 41, 55, 1)', // border-gray-800
        },
      },
    },
  },
});

export default theme;
