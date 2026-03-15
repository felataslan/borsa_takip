'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches rendering errors in child components
 * and displays a user-friendly fallback UI instead of a blank white screen.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 3,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: '50%',
              bgcolor: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e',
              display: 'flex',
            }}
          >
            <AlertTriangle size={48} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Bir sorun oluştu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
            Uygulama beklenmedik bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={18} />}
            onClick={this.handleReset}
            sx={{
              mt: 1,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
            }}
          >
            Tekrar Dene
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
