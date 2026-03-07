'use client';

import React, { useEffect, useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockCard from '@/components/StockCard';
import { Activity, Search } from 'lucide-react';

import { Box, Container, Typography, CircularProgress, Alert, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Veriler gelirken bir hata oluştu');
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderStocks = () => {
    // Filter stocks first
    const filteredStocks = stocks.filter((stock) => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            stock.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    if (filteredStocks.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 4, backdropFilter: 'blur(12px)', border: '1px solid', borderColor: 'divider' }}>
          <Search size={48} color="rgba(55, 65, 81, 1)" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h6" color="text.primary" gutterBottom>Arama kriterlerinize uygun hisse bulunamadı.</Typography>
          <Typography variant="body2" color="text.secondary">Lütfen farklı bir arama terimi veya sektör seçerek tekrar deneyin.</Typography>
        </Box>
      );
    }

    // Group filtered stocks by sector
    const groupedStocks = filteredStocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Diğer';
      if (!acc[sector]) {
        acc[sector] = [];
      }
      acc[sector].push(stock);
      return acc;
    }, {} as Record<string, Stock[]>);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 10 }}>
        {Object.entries(groupedStocks).map(([sector, sectorStocks]) => (
          <Box key={sector} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
              }}
            >
              {sector}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
                },
              }}
            >
              {sectorStocks.map((stock, idx) => (
                <StockCard key={stock.symbol} stock={stock} index={idx} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <Activity color="#22c55e" size={32} />
          Borsa İstanbul Piyasaları
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 'md' }}>
          En çok işlem gören BİST hisselerinin güncel fiyatları ve değişim oranları. (Veriler Yahoo Finance üzerinden 15 dk gecikmeli sağlanmaktadır)
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
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, position: 'relative', zIndex: 10 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Hisse sembolü veya adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="#9ca3af" size={20} />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'background.paper', backdropFilter: 'blur(12px)' }
              }}
            />
            <FormControl fullWidth sx={{ minWidth: { sm: 240 }, bgcolor: 'background.paper', backdropFilter: 'blur(12px)', borderRadius: 1 }}>
              <InputLabel id="sector-select-label">Sektör</InputLabel>
              <Select
                labelId="sector-select-label"
                value={selectedSector}
                label="Sektör"
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <MenuItem value="All">Tüm Sektörler</MenuItem>
                {Array.from(new Set(stocks.map(s => s.sector || 'Diğer'))).sort().map((sector) => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {renderStocks()}
        </>
      )}
      
      {/* Background decoration elements */}
      <Box sx={{ position: 'fixed', top: 80, right: 0, zIndex: -10, height: 256, width: 256, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, zIndex: -10, height: 384, width: 384, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.05)', filter: 'blur(150px)', pointerEvents: 'none' }} />
    </Container>
  );
}
