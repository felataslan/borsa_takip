import React, { useState, useEffect } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppTheme } from '@/theme/ThemeProvider';

interface ChartData {
  date: string;
  price: number;
}

interface StockHistoryChartProps {
  symbol: string;
  onDataUpdate?: (periodLabel: string, changePct: number | null, changeVal: number | null) => void;
}

type Period = '1d' | '2w' | '1m' | '3m' | '6m' | '1y';

export default function StockHistoryChart({ symbol, onDataUpdate }: StockHistoryChartProps) {
  const { mode } = useAppTheme();
  const [period, setPeriod] = useState<Period>('1d');
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stocks/${symbol}/history?period=${period}`);
        if (!response.ok) {
          throw new Error('Geçmiş veriler alınamadı.');
        }
        const result = await response.json();
        
        // Format dates for the chart
        const formatted = result.map((item: { date: string, price: number, open?: number, high?: number, low?: number, volume?: number }) => {
           const d = new Date(item.date);
           let dateStr = '';
           
           if (period === '1d') {
              dateStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
           } else if (period === '2w' || period === '1m') {
              dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
           } else {
              dateStr = d.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
           }
           
           return {
             ...item,
             displayDate: dateStr,
             numericDate: d.getTime()
           }
        });

        if (isSubscribed) {
          setData(formatted);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
          setError(errorMessage);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    if (symbol) {
      fetchHistory();
    }

    return () => {
      isSubscribed = false;
    };
  }, [symbol, period]);

  // Pass dynamic percentage up to parent
  useEffect(() => {
    if (onDataUpdate) {
      if (period === '1d') {
        // Let parent fallback to exact Yahoo Finance daily change
        onDataUpdate('Günlük', null, null);
      } else if (data.length >= 2) {
        const firstPrice = data[0].price;
        const lastPrice = data[data.length - 1].price;
        const changeVal = lastPrice - firstPrice;
        const changePct = firstPrice > 0 ? (changeVal / firstPrice) * 100 : 0;
        
        const labels: Record<string, string> = {
          '2w': '2 Haftalık',
          '1m': 'Aylık',
          '3m': '3 Aylık',
          '6m': '6 Aylık',
          '1y': 'Yıllık',
        };
        onDataUpdate(labels[period] || 'Değişim', changePct, changeVal);
      } else {
        onDataUpdate('Günlük', null, null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, period]);

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: Period | null,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const isPositive = data.length >= 2 ? data[data.length - 1].price >= data[0].price : true;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // Green if up, Red if down

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
          Fiyat Geçmişi
        </Typography>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="zaman aralığı"
          size="small"
          sx={{
            height: 32,
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                '&:hover': {
                   bgcolor: mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                }
              }
            }
          }}
        >
          <ToggleButton value="1d" aria-label="1 gün">1G</ToggleButton>
          <ToggleButton value="2w" aria-label="2 hafta">2H</ToggleButton>
          <ToggleButton value="1m" aria-label="1 ay">1A</ToggleButton>
          <ToggleButton value="3m" aria-label="3 ay">3A</ToggleButton>
          <ToggleButton value="6m" aria-label="6 ay">6A</ToggleButton>
          <ToggleButton value="1y" aria-label="1 yıl">1Y</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 250, position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} thickness={5} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="error" variant="body2">{error}</Typography>
          </Box>
        ) : data.length === 0 ? (
           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary" variant="body2">Veri bulunamadı.</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(val) => `₺${val.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                itemStyle={{ color: 'text.primary', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', marginBottom: 4 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`₺${Number(value).toFixed(2)}`, 'Fiyat']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: strokeColor, stroke: mode === 'dark' ? '#111827' : '#ffffff', strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
