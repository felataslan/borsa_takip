'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Cell } from 'recharts';
import { IPOStock } from '@/types/stock.types';
import { useAppTheme } from '@/theme/ThemeProvider';
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

export default function IpoReturnChart({ stocks }: IpoReturnChartProps) {
  const { mode } = useAppTheme();

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
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 4, fontWeight: 'bold' }}>
        Halka Arz Sonrası Toplam Getiri (%)
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stocks} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
            <defs>
              <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={1} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.8} />
              </linearGradient>
            </defs>
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
            <Bar dataKey="totalReturnPercent" radius={[6, 6, 0, 0]} animationDuration={1500}>
              {stocks.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    mode === 'dark'
                      ? '#ffffff'
                      : entry.totalReturnPercent >= 0
                      ? '#10b981'
                      : '#f43f5e'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
