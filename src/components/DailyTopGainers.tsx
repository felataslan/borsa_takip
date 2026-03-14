'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { Stock } from '@/types/stock.types';

interface DailyTopGainersProps {
  stocks: Stock[];
}

export default function DailyTopGainers({ stocks }: DailyTopGainersProps) {
  // Sort stocks by regularMarketChangePercent descending and take top 10
  const topGainers = [...stocks]
    .filter(s => s.regularMarketChangePercent > 0)
    .sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent)
    .slice(0, 10);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(34, 197, 94, 0.1)',
            display: 'flex',
          }}
        >
          <TrendingUp color="#22c55e" size={20} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Günün Yükselenleri
        </Typography>
      </Box>

      {topGainers.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Yükselen hisse bulunamadı.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--mui-palette-divider)', borderRadius: 4 },
          }}
        >
          {topGainers.map((stock, index) => (
            <Box
              key={stock.symbol}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    #{index + 1}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {stock.symbol.replace('.IS', '')}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  ₺{stock.regularMarketPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#22c55e' }}>
                <TrendingUp size={14} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  +{stock.regularMarketChangePercent.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
