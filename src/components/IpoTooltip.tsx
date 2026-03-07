import React from 'react';
import { Box, Typography } from '@mui/material';
import type { IPOStock } from '@/types/stock.types';

interface IpoTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

/**
 * Custom tooltip for the IPO bar chart.
 * Extracted from the halkaarz page so it is not recreated on every render.
 */
export default function IpoTooltip({ active, payload, label }: IpoTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as IPOStock;
  const isPos = data.totalReturnPercent >= 0;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
        {data.ipoName} ({label})
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        Halka Arz: {data.ipoPrice.toFixed(2)} ₺
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        Anlık Fiyat: {data.regularMarketPrice.toFixed(2)} ₺
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: isPos ? '#4ade80' : '#f87171', fontWeight: 'bold', mt: 1 }}
      >
        Getiri: {isPos ? '+' : ''}
        {data.totalReturnPercent.toFixed(2)}%
      </Typography>
    </Box>
  );
}
