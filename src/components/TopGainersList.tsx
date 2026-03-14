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
        borderRadius: 4,
        background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
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
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(34, 197, 94, 0.1)',
            display: 'flex',
          }}
        >
          <TrendingUp color="#22c55e" size={24} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            px: 0.5,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--mui-palette-divider)', borderRadius: 4 },
          }}
        >
          {currentStocks.map((stock, index) => (
            <Box
              key={stock.symbol}
              sx={{
                flex: '0 0 auto',
                width: { xs: 160, sm: 180 },
                p: 2,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {stock.symbol.replace('.IS', '')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  #{index + 1}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '0.75rem'
                }}
              >
                {stock.shortName}
              </Typography>

              <Box sx={{ mt: 'auto', pt: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  ₺{stock.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <TrendingUp size={14} />
                  +{stock.gainPercent.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
