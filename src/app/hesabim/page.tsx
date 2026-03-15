'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import AddPortfolioForm from '@/components/AddPortfolioForm';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { useFetch } from '@/hooks/useFetch';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { Stock } from '@/types/stock.types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { useMounted } from '@/hooks/useMounted';
import { COLOR_POSITIVE, COLOR_NEGATIVE, COLOR_POSITIVE_BG, COLOR_NEGATIVE_BG } from '@/constants/colors';

const BACKGROUND_ORBS = [
  { color: 'rgba(59, 130, 246, 0.15)', top: '10%', left: '20%' },
  { color: 'rgba(16, 185, 129, 0.15)', top: '40%', right: '10%' },
  { color: 'rgba(99, 102, 241, 0.1)', bottom: '20%', left: '30%' },
];

export default function PortfolioPage() {
  const { data: stocks, loading, error } = useFetch<Stock[]>('/api/stocks', { initialData: [] });
  const { items, addOrUpdateStock, removeStock } = usePortfolioStore();
  const isMounted = useMounted();

  // Map portfolio items to fresh live data
  const portfolioData = useMemo(() => {
    return items.map((item) => {
      const liveStock = stocks.find((s) => s.symbol === item.symbol);
      const currentPrice = liveStock?.regularMarketPrice || 0;
      const totalValue = currentPrice * item.lots;
      
      const averageCost = item.averageCost || 0;
      const totalCost = averageCost * item.lots;
      
      const profitLoss = totalValue - totalCost;
      const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      return {
        ...item,
        liveStock,
        currentPrice,
        totalValue,
        totalCost,
        profitLoss,
        profitLossPercentage,
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [items, stocks]);

  const totalInvestment = portfolioData.reduce((sum, item) => sum + item.totalCost, 0);
  const currentTotalValue = portfolioData.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfitLoss = currentTotalValue - totalInvestment;
  const totalProfitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <PageHeader
        icon={<Wallet color="#3b82f6" size={32} />}
        title="Hesabım (Portföy)"
        subtitle="Yatırımlarınızı takip edin, kâr/zarar durumunuzu anlık olarak görüntüleyin."
      />

      {loading || !isMounted ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 6, position: 'relative', zIndex: 10 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Toplam Maliyet (Yatırım)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {totalInvestment.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Güncel Portföy Değeri
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {currentTotalValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Toplam Kâr / Zarar
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: totalProfitLoss >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE 
                      }}
                    >
                      {totalProfitLoss > 0 ? '+' : ''}{totalProfitLoss.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                    </Typography>
                    <Chip 
                      size="small"
                      icon={totalProfitLoss >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                      label={`${totalProfitLoss > 0 ? '+' : ''}${totalProfitLossPercentage.toFixed(2)}%`}
                      sx={{
                         bgcolor: totalProfitLoss >= 0 ? COLOR_POSITIVE_BG : COLOR_NEGATIVE_BG,
                         color: totalProfitLoss >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE,
                         fontWeight: 'bold',
                         '& .MuiChip-icon': { color: totalProfitLoss >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Add Stock Form */}
          <AddPortfolioForm stocks={stocks} onAdd={addOrUpdateStock} />

          {/* Portfolio List */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', position: 'relative', zIndex: 10 }}>Portföyümdeki Hisseler</Typography>
          
          {portfolioData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, position: 'relative', zIndex: 10 }}>
                <Typography variant="h6" color="text.secondary">Henüz portföyünüze hisse eklemediniz.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ position: 'relative', zIndex: 10 }}>
              {portfolioData.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.symbol}>
                  <PortfolioItemCard item={item} onRemove={removeStock} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
