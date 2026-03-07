import React from 'react';
import { Box, CircularProgress } from '@mui/material';

/** Centred loading spinner for full-height data-loading states. */
export default function LoadingState() {
  return (
    <Box sx={{ display: 'flex', height: 256, alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  );
}
