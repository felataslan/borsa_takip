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
  const isTotalPos = data.totalReturnPercent >= 0;
  const isDailyPos = data.regularMarketChangePercent >= 0;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1.5, fontWeight: 700 }}>
        {data.ipoName} ({label})
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Halka Arz:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{data.ipoPrice.toFixed(2)} ₺</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Anlık Fiyat:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{data.regularMarketPrice.toFixed(2)} ₺</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Toplam Getiri:</Typography>
          <Typography
            variant="body2"
            sx={{ color: isTotalPos ? '#10b981' : '#f43f5e', fontWeight: 800 }}
          >
            {isTotalPos ? '+' : ''}{data.totalReturnPercent.toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Günlük Değişim:</Typography>
          <Typography
            variant="body2"
            sx={{ color: isDailyPos ? '#10b981' : '#f43f5e', fontWeight: 800 }}
          >
            {isDailyPos ? '+' : ''}{data.regularMarketChangePercent.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
