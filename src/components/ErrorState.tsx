import React from 'react';
import { Box, Alert } from '@mui/material';

interface ErrorStateProps {
  message: string;
}

/** Reusable centred error alert. */
export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', mt: 6 }}>
      <Alert
        severity="error"
        variant="outlined"
        sx={{ bgcolor: 'rgba(127, 29, 29, 0.2)', color: '#f87171' }}
      >
        {message}
      </Alert>
    </Box>
  );
}
