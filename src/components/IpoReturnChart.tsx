'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { Cell } from 'recharts';
import { IPOStock } from '@/types/stock.types';
import IpoTooltip from '@/components/IpoTooltip';
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

interface IpoReturnChartProps {
  stocks: IPOStock[];
}

type MetricType = 'totalReturnPercent' | 'regularMarketChangePercent';

export default function IpoReturnChart({ stocks }: IpoReturnChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('totalReturnPercent');

  const handleMetricChange = (_: React.SyntheticEvent, newValue: MetricType) => {
    setActiveMetric(newValue);
  };

  return (
    <Box
      sx={{
        mb: 6,
        position: 'relative',
        zIndex: 10,
        bgcolor: 'background.paper',
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 4, gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          {activeMetric === 'totalReturnPercent' ? 'Halka Arz Sonrası Toplam Getiri (%)' : 'Günlük Değişim (%)'}
        </Typography>
        
        <Tabs
          value={activeMetric}
          onChange={handleMetricChange}
          sx={{
            minHeight: 36,
            '& .MuiTabs-indicator': { height: '100%', borderRadius: 1.5, zIndex: 0, opacity: 0.1, bgcolor: activeMetric === 'totalReturnPercent' ? 'primary.main' : 'success.main' },
            '& .MuiTab-root': {
              minHeight: 36,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              zIndex: 1,
              px: 3,
              borderRadius: 1.5,
              transition: 'all 0.2s',
              '&.Mui-selected': { color: activeMetric === 'totalReturnPercent' ? 'primary.main' : 'success.main' }
            }
          }}
        >
          <Tab value="totalReturnPercent" label="Toplam Getiri" />
          <Tab value="regularMarketChangePercent" label="Günlük Değişim" />
        </Tabs>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stocks} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(156, 163, 175, 0.2)"
              vertical={false}
            />
            <XAxis
              dataKey="symbol"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
              tickFormatter={(val: string) => val.replace('.IS', '')}
              angle={-45}
              textAnchor="end"
              tickMargin={10}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontWeight: 500 }}
              tickFormatter={(val: number) => `${val}%`}
            />
            <Tooltip content={<IpoTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }} />
            <Bar dataKey={activeMetric} radius={[6, 6, 0, 0]} animationDuration={1000}>
              {stocks.map((entry, index) => {
                const value = entry[activeMetric];
                const color = value >= 0 ? '#10b981' : '#f43f5e';
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
