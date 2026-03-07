'use client';

import React, { useEffect, useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockCard from '@/components/StockCard';
import { Search, TrendingUp } from 'lucide-react';
import { Box, Container, Typography, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { BIST_30 } from '@/data/bist-indexes';

export default function Bist30Page() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Veriler gelirken bir hata oluştu');
        }
        const data = await response.json();
        const bist30Stocks = data.filter((stock: Stock) => BIST_30.includes(stock.symbol));
        setStocks(bist30Stocks);
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

  const filteredStocks = stocks.filter((stock) => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <TrendingUp color="#3b82f6" size={32} />
          BİST 30 Piyasası
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 'md' }}>
          Borsa İstanbul&apos;da işlem gören, piyasa değeri ve işlem hacmi en yüksek 30 hisse senedinin anlık verileri.
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
          <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="BİST 30 listesinde hisse ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="#9ca3af" size={20} />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(12px)' }
              }}
            />
          </Box>
          
          {filteredStocks.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'rgba(17, 24, 39, 0.5)', borderRadius: 4, backdropFilter: 'blur(12px)', border: '1px solid rgba(31, 41, 55, 1)' }}>
              <Search size={48} color="rgba(55, 65, 81, 1)" style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>Sonuç bulunamadı.</Typography>
            </Box>
          ) : (
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
                position: 'relative',
                zIndex: 10,
              }}
            >
              {filteredStocks.map((stock, idx) => (
                <StockCard key={stock.symbol} stock={stock} index={idx} />
              ))}
            </Box>
          )}
        </>
      )}
      
      {/* Background decoration elements */}
      <Box sx={{ position: 'fixed', top: 80, left: 0, zIndex: -10, height: 256, width: 256, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: -10, height: 384, width: 384, borderRadius: '50%', bgcolor: 'rgba(139, 92, 246, 0.05)', filter: 'blur(150px)', pointerEvents: 'none' }} />
    </Container>
  );
}
