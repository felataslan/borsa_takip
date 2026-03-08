'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import { Wallet, TrendingUp, TrendingDown, Trash2, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useFetch } from '@/hooks/useFetch';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { Stock } from '@/types/stock.types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { useMounted } from '@/hooks/useMounted';

const BACKGROUND_ORBS = [
  { color: 'rgba(59, 130, 246, 0.15)', top: '10%', left: '20%' },
  { color: 'rgba(16, 185, 129, 0.15)', top: '40%', right: '10%' },
  { color: 'rgba(99, 102, 241, 0.1)', bottom: '20%', left: '30%' },
];

export default function PortfolioPage() {
  const { data: stocks, loading, error } = useFetch<Stock[]>('/api/stocks', { initialData: [] });
  const { items, addOrUpdateStock, removeStock } = usePortfolioStore();

  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [inputLots, setInputLots] = useState<string>('');
  const [inputCost, setInputCost] = useState<string>('');
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

  const handleAddStock = () => {
    if (selectedStock && inputLots) {
      const parsedCost = inputCost !== '' ? Number(inputCost.replace(',', '.')) : undefined;
      
      addOrUpdateStock(selectedStock, Number(inputLots), parsedCost);
      setSelectedStock(null);
      setInputLots('');
      setInputCost('');
    }
  };

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
                        color: totalProfitLoss >= 0 ? '#10b981' : '#f43f5e' 
                      }}
                    >
                      {totalProfitLoss > 0 ? '+' : ''}{totalProfitLoss.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                    </Typography>
                    <Chip 
                      size="small"
                      icon={totalProfitLoss >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                      label={`${totalProfitLoss > 0 ? '+' : ''}${totalProfitLossPercentage.toFixed(2)}%`}
                      sx={{
                         bgcolor: totalProfitLoss >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                         color: totalProfitLoss >= 0 ? '#10b981' : '#f43f5e',
                         fontWeight: 'bold',
                         '& .MuiChip-icon': { color: totalProfitLoss >= 0 ? '#10b981' : '#f43f5e' },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Add Stock Section */}
          <Card sx={{ mb: 6, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4, position: 'relative', zIndex: 10 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Portföye Hisse Ekle</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <Autocomplete
                    options={stocks.map(s => s.symbol)}
                    value={selectedStock}
                    onChange={(_, newValue) => setSelectedStock(newValue)}
                    renderInput={(params) => <TextField {...params} label="Hisse Seç (Örn: THYAO.IS)" variant="outlined" />}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField 
                    fullWidth 
                    label="Lot Adeti" 
                    type="number" 
                    value={inputLots} 
                    onChange={(e) => setInputLots(e.target.value)} 
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField 
                    fullWidth 
                    label="Maliyet Fiyatı (₺)" 
                    type="number" 
                    value={inputCost} 
                    onChange={(e) => setInputCost(e.target.value)} 
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="large"
                    disabled={!selectedStock || !inputLots}
                    onClick={handleAddStock}
                    startIcon={<Plus size={20} />}
                    sx={{ height: 56, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Ekle
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                  <Card sx={{  
                    bgcolor: 'background.paper', 
                    borderRadius: 3, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.symbol.replace('.IS', '')}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.liveStock?.shortName || 'Yükleniyor...'}</Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => removeStock(item.symbol)}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#f43f5e', bgcolor: 'rgba(244, 63, 94, 0.1)' } }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Adet (Lot)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.lots}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Maliyet Fiyatı</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.averageCost?.toFixed(2) || '0.00'} ₺</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Anlık Fiyat</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.currentPrice.toFixed(2)} ₺</Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Toplam Değer</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</Typography>
                         </Box>
                         <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Kâr/Zarar</Typography>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 'bold', 
                              color: item.profitLoss >= 0 ? '#10b981' : '#f43f5e' 
                            }}>
                              {item.profitLoss > 0 ? '+' : ''}{item.profitLoss.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                            </Typography>
                         </Box>
                      </Box>
                    </CardContent>
                  </Card>
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
