'use client';

import React, { useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockCard from '@/components/StockCard';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { Activity, Search } from 'lucide-react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useStocks } from '@/hooks/useStocks';
import { useStockFilter } from '@/hooks/useStockFilter';

const BACKGROUND_ORBS = [
  { color: 'rgba(34, 197, 94, 0.05)', top: 80, right: 0 },
  { color: 'rgba(59, 130, 246, 0.05)', bottom: 0, left: 0, size: 384, blur: 150 },
];

const GRID_COLS = {
  xs: '1fr',
  sm: 'repeat(2, 1fr)',
  md: 'repeat(3, 1fr)',
  lg: 'repeat(4, 1fr)',
  xl: 'repeat(5, 1fr)',
};

export default function Home() {
  const { data: stocks, loading, error } = useStocks<Stock>('/api/stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const { filteredStocks, sectors } = useStockFilter(stocks, searchQuery, selectedSector);

  // Group filtered stocks by sector
  const groupedStocks = filteredStocks.reduce(
    (acc, stock) => {
      const sector = stock.sector || 'Diğer';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(stock);
      return acc;
    },
    {} as Record<string, Stock[]>,
  );

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Activity color="#22c55e" size={32} />}
        title="Borsa İstanbul Piyasaları"
        subtitle="En çok işlem gören BİST hisselerinin güncel fiyatları ve değişim oranları. (Veriler Yahoo Finance üzerinden 15 dk gecikmeli sağlanmaktadır)"
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* Search + Sector Filter row */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              position: 'relative',
              zIndex: 10,
            }}
          >
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
                sx: { bgcolor: 'background.paper', backdropFilter: 'blur(12px)' },
              }}
            />
            <FormControl
              sx={{
                minWidth: { sm: 240 },
                bgcolor: 'background.paper',
                backdropFilter: 'blur(12px)',
                borderRadius: 1,
              }}
            >
              <InputLabel id="sector-select-label">Sektör</InputLabel>
              <Select
                labelId="sector-select-label"
                value={selectedSector}
                label="Sektör"
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <MenuItem value="All">Tüm Sektörler</MenuItem>
                {sectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Sectored stock grid */}
          {Object.keys(groupedStocks).length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                mt: 8,
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 4,
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Search size={48} color="rgba(55, 65, 81, 1)" style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Arama kriterlerinize uygun hisse bulunamadı.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lütfen farklı bir arama terimi veya sektör seçerek tekrar deneyin.
              </Typography>
            </Box>
          ) : (
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
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: GRID_COLS }}>
                    {sectorStocks.map((stock, idx) => (
                      <StockCard key={stock.symbol} stock={stock} index={idx} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
