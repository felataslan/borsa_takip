'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { TopGainerStock } from '@/types/stock.types';
import { useFetch } from '@/hooks/useFetch';

type Period = '3m' | '6m' | '1y' | '5y';

interface TopGainersResponse {
  '3m': TopGainerStock[];
  '6m': TopGainerStock[];
  '1y': TopGainerStock[];
  '5y': TopGainerStock[];
}

const PERIODS: { value: Period; label: string }[] = [
  { value: '3m', label: '3 Ay' },
  { value: '6m', label: '6 Ay' },
  { value: '1y', label: '1 Yıl' },
  { value: '5y', label: '5 Yıl' },
];

export default function TopGainersList() {
  const { data, loading, error } = useFetch<TopGainersResponse>('/api/stocks/top-gainers', {
    initialData: { '3m': [], '6m': [], '1y': [], '5y': [] }
  });
  const [activeTab, setActiveTab] = useState(0);

  const activePeriod = PERIODS[activeTab].value;
  const currentStocks = data?.[activePeriod] || [];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 5,
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            p: 1.25,
            borderRadius: 3,
            bgcolor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
          }}
        >
          <TrendingUp size={22} strokeWidth={2.5} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
          En Çok Yükselenler (BİST 100)
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minWidth: 80 },
          }}
        >
          {PERIODS.map((p) => (
            <Tab key={p.value} label={p.label} />
          ))}
        </Tabs>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={32} sx={{ color: '#22c55e' }} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          En çok yükselenler verisi alınamadı.
        </Alert>
      )}

      {!loading && !error && currentStocks.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Bu periyoda ait veri bulunamadı.
        </Typography>
      )}

      {!loading && !error && currentStocks.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            overflowY: 'auto',
            maxHeight: 600,
            pr: 1,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--mui-palette-divider)', borderRadius: 4 },
          }}
        >
          {currentStocks.map((stock, index) => (
            <Box
              key={stock.symbol}
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 20px -5px rgba(16, 185, 129, 0.15)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      #{index + 1}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                      {stock.symbol.replace('.IS', '')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      display: 'block',
                      maxWidth: 150
                    }}
                  >
                    {stock.shortName}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    ₺{stock.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.25,
                    }}
                  >
                    <TrendingUp size={12} strokeWidth={3} />
                    +{stock.gainPercent.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
