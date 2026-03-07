'use client';

import React from 'react';
import { IPOStock } from '@/types/stock.types';
import { Rocket, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import IpoTooltip from '@/components/IpoTooltip';
import { useStocks } from '@/hooks/useStocks';

// Dynamically import recharts to avoid SSR issues
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

const BACKGROUND_ORBS = [
  { color: 'rgba(236, 72, 153, 0.05)', top: 120, left: 40 },
  { color: 'rgba(59, 130, 246, 0.05)', bottom: 0, right: 0, size: 384, blur: 150 },
];

/**
 * Transforms raw API stock data (which may have partial IPO fields) into the
 * strongly-typed IPOStock shape used by this page.
 */
function toIPOStock(stock: Record<string, unknown>): IPOStock {
  const currentPrice =
    (stock.regularMarketPrice as number) ||
    (stock.price as number) ||
    (stock.ipoPrice as number) ||
    0;
  const ipoPrice = (stock.ipoPrice as number) || 0;
  const totalReturnPercent = ipoPrice > 0 ? ((currentPrice - ipoPrice) / ipoPrice) * 100 : 0;

  return {
    symbol: stock.symbol as string,
    shortName: (stock.shortName as string) || (stock.ipoName as string) || (stock.symbol as string),
    regularMarketPrice: currentPrice,
    regularMarketChangePercent: (stock.regularMarketChangePercent as number) || 0,
    regularMarketChange: 0,
    currency: 'TRY',
    ipoPrice,
    ipoDate: (stock.ipoDate as string) || 'Bilinmiyor',
    ipoName: (stock.ipoName as string) || (stock.shortName as string) || (stock.symbol as string),
    totalReturnPercent,
  };
}

export default function IposPage() {
  const { data: rawData, loading, error } = useStocks<Record<string, unknown>>(
    '/api/stocks?index=HALKAARZ',
  );

  const ipoStocks: IPOStock[] = rawData.map(toIPOStock);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Rocket color="#ec4899" size={32} />}
        title="Yeni Halka Arzlar (Son 3 Ay)"
        subtitle="Borsa İstanbul'da yakın zamanda işlem görmeye başlayan hisselerin halka arz fiyatlarına göre anlık getiri oranları ve analizleri."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* Bar Chart */}
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
                <BarChart data={ipoStocks} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
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
                    {ipoStocks.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.totalReturnPercent >= 0 ? 'url(#colorPos)' : 'url(#colorNeg)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* IPO Detail Cards */}
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              position: 'relative',
              zIndex: 10,
            }}
          >
            {ipoStocks.map((stock, idx) => {
              const isPos = stock.totalReturnPercent >= 0;
              return (
                <Card
                  key={stock.symbol}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  sx={{
                    bgcolor: 'background.paper',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 3,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                          {stock.symbol.replace('.IS', '')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stock.ipoName}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<Clock size={14} />}
                        label={stock.ipoDate}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(156, 163, 175, 0.1)',
                          color: 'text.secondary',
                          '& .MuiChip-icon': { color: 'text.secondary' },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Halka Arz Fiyatı
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {stock.ipoPrice.toFixed(2)} ₺
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Anlık Fiyat
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                          {stock.regularMarketPrice.toFixed(2)} ₺
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Toplam Getiri:
                      </Typography>
                      <Chip
                        icon={isPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        label={`${isPos ? '+' : ''}${stock.totalReturnPercent.toFixed(2)}%`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: isPos ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isPos ? '#4ade80' : '#f87171',
                          '& .MuiChip-icon': { color: isPos ? '#4ade80' : '#f87171' },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
