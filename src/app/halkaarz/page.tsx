'use client';

import React, { useEffect, useState } from 'react';
import { Stock } from '@/types/stock.types';
import { Rocket, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Box, Container, Typography, CircularProgress, Alert, Card, CardContent, Chip } from '@mui/material';
import { motion } from 'framer-motion';

// dynamically import recharts to avoid SSR issues
import dynamic from 'next/dynamic';
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

interface IPOData extends Stock {
  ipoPrice: number;
  ipoDate: string;
  ipoName: string;
  totalReturnPercent: number;
}

interface APIStockData {
  symbol: string;
  name?: string;
  shortName?: string;
  price?: number;
  regularMarketPrice?: number;
  changePercent?: number;
  regularMarketChangePercent?: number;
  previousClose?: number;
  description?: string;
  ipoPrice?: number;
  ipoDate?: string;
  ipoName?: string;
}

export default function IposPage() {
  const [ipoStocks, setIpoStocks] = useState<IPOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch('/api/stocks?index=HALKAARZ');
        if (!response.ok) {
          throw new Error('Veriler gelirken bir hata oluştu');
        }
        
        const data: APIStockData[] = await response.json();
        
        // Finalize the calculation for total return percentage
        const mergedData: IPOData[] = data.map(stock => {
          const currentPrice = stock.regularMarketPrice || stock.price || stock.ipoPrice || 0;
          let totalReturnPercent = 0;
          if (stock.ipoPrice) {
             totalReturnPercent = ((currentPrice - stock.ipoPrice) / stock.ipoPrice) * 100;
          }
          
          return {
            symbol: stock.symbol,
            shortName: stock.shortName || stock.name || stock.symbol,
            regularMarketPrice: currentPrice,
            regularMarketChangePercent: stock.regularMarketChangePercent || stock.changePercent || 0,
            regularMarketChange: 0,
            currency: 'TRY',
            ipoPrice: stock.ipoPrice || 0,
            ipoDate: stock.ipoDate || 'Bilinmiyor',
            ipoName: stock.ipoName || stock.shortName || stock.symbol,
            totalReturnPercent,
          };
        }).sort((a, b) => b.totalReturnPercent - a.totalReturnPercent);

        setIpoStocks(mergedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
    
    // Refresh only every 5 minutes to avoid hitting the scraper API too often
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom Tooltip for the chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as IPOData;
      const isPos = data.totalReturnPercent >= 0;
      return (
        <Box sx={{ bgcolor: 'rgba(17, 24, 39, 0.9)', p: 2, borderRadius: 2, border: '1px solid rgba(55, 65, 81, 1)', backdropFilter: 'blur(8px)' }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>{data.ipoName} ({label})</Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Halka Arz: {data.ipoPrice.toFixed(2)} ₺</Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Anlık Fiyat: {data.regularMarketPrice.toFixed(2)} ₺</Typography>
          <Typography variant="body2" sx={{ color: isPos ? '#4ade80' : '#f87171', fontWeight: 'bold', mt: 1 }}>
            Getiri: {isPos ? '+' : ''}{data.totalReturnPercent.toFixed(2)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <Box sx={{ mb: 6, position: 'relative', zIndex: 10 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <Rocket color="#ec4899" size={32} />
          Yeni Halka Arzlar (Son 3 Ay)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 'md' }}>
          Borsa İstanbul&apos;da yakın zamanda işlem görmeye başlayan hisselerin halka arz fiyatlarına göre anlık getiri oranları ve analizleri.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', height: 256, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box sx={{ maxWidth: 'md', mx: 'auto', mt: 6 }}>
          <Alert severity="error" variant="outlined" sx={{ bgcolor: 'rgba(127, 29, 29, 0.2)', color: '#f87171' }}>
            {error}
          </Alert>
        </Box>
      ) : (
        <>
          {/* Main Chart Section */}
          <Box sx={{ mb: 6, position: 'relative', zIndex: 10, bgcolor: 'rgba(17, 24, 39, 0.3)', p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid rgba(31, 41, 55, 1)' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 4, fontWeight: 'bold' }}>
              Halka Arz Sonrası Toplam Getiri (%)
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ipoStocks} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                  <defs>
                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={1}/> {/* emerald-500 */}
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/> {/* emerald-600 */}
                    </linearGradient>
                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/> {/* rose-500 */}
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.8}/> {/* rose-600 */}
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.4)" vertical={false} />
                  <XAxis 
                    dataKey="symbol" 
                    stroke="#9ca3af" 
                    tick={{ fill: '#d1d5db', fontSize: 13, fontWeight: 500 }} 
                    tickFormatter={(val) => val.replace('.IS', '')}
                    angle={-45}
                    textAnchor="end"
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{ fill: '#d1d5db', fontWeight: 500 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} 
                  />
                  <Bar dataKey="totalReturnPercent" radius={[6, 6, 0, 0]} animationDuration={1500}>
                    {ipoStocks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.totalReturnPercent >= 0 ? 'url(#colorPos)' : 'url(#colorNeg)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Individual Detail Cards Section */}
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
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
                    bgcolor: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(31, 41, 55, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
                        sx={{ bgcolor: 'rgba(55, 65, 81, 0.5)', color: 'text.secondary', '& .MuiChip-icon': { color: 'text.secondary' } }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Halka Arz Fiyatı</Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>{stock.ipoPrice.toFixed(2)} ₺</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Anlık Fiyat</Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{stock.regularMarketPrice.toFixed(2)} ₺</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(55, 65, 81, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Toplam Getiri:</Typography>
                      <Chip
                        icon={isPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        label={`${isPos ? '+' : ''}${stock.totalReturnPercent.toFixed(2)}%`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: isPos ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isPos ? '#4ade80' : '#f87171',
                          '& .MuiChip-icon': {
                            color: isPos ? '#4ade80' : '#f87171',
                          },
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
      
      {/* Background decoration elements */}
      <Box sx={{ position: 'fixed', top: 120, left: 40, zIndex: -10, height: 256, width: 256, borderRadius: '50%', bgcolor: 'rgba(236, 72, 153, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: -10, height: 384, width: 384, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.05)', filter: 'blur(150px)', pointerEvents: 'none' }} />
    </Container>
  );
}
