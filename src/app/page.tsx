'use client';

import React, { useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockCard from '@/components/StockCard';
import StockGrid from '@/components/StockGrid';
import StockDetailModal from '@/components/StockDetailModal';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { Activity, Search, Star } from 'lucide-react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useStockFilter } from '@/hooks/useStockFilter';
import { useFavoritesStore } from '@/store/useFavoritesStore';

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
  const { data: stocks, loading, error } = useFetch<Stock[]>('/api/stocks', { initialData: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { filteredStocks, sectors } = useStockFilter(stocks, searchQuery, selectedSector);

  const { favorites } = useFavoritesStore();
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const { filteredStocks: filteredFavorites } = useStockFilter(favorites, favSearchQuery);

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

      {/* Tabs */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 10, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.95rem' },
            '& .Mui-selected': { fontWeight: 700 },
          }}
        >
          <Tab label="Sektörler" id="tab-sectors" aria-controls="tabpanel-sectors" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star size={16} fill={activeTab === 1 ? 'currentColor' : 'none'} />
                Favorilerim
                {favorites.length > 0 && (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      px: 0.8,
                      py: 0.1,
                      lineHeight: 1.6,
                    }}
                  >
                    {favorites.length}
                  </Box>
                )}
              </Box>
            }
            id="tab-favorites"
            aria-controls="tabpanel-favorites"
          />
        </Tabs>
      </Box>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* ─── SEKTÖRLER TAB ─── */}
          <Box
            role="tabpanel"
            id="tabpanel-sectors"
            aria-labelledby="tab-sectors"
            hidden={activeTab !== 0}
          >
            {activeTab === 0 && (
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
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="#9ca3af" size={20} />
                          </InputAdornment>
                        ),
                        sx: { bgcolor: 'background.paper', backdropFilter: 'blur(12px)' },
                      },
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
                            <StockCard key={stock.symbol} stock={stock} index={idx} onClick={(s) => setSelectedStock(s)} />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* ─── FAVORİLER TAB ─── */}
          <Box
            role="tabpanel"
            id="tabpanel-favorites"
            aria-labelledby="tab-favorites"
            hidden={activeTab !== 1}
          >
            {activeTab === 1 && (
              favorites.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    mt: 8,
                    p: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Star size={48} color="#eab308" style={{ margin: '0 auto 16px' }} />
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Henüz favori hisse eklemediniz.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bir hisse kartına tıklayarak detay modalından yıldız ikonuna basın.
                  </Typography>
                </Box>
              ) : (
                <StockGrid
                  stocks={filteredFavorites}
                  searchQuery={favSearchQuery}
                  onSearchChange={setFavSearchQuery}
                  placeholder="Favorilerim arasında ara..."
                />
              )
            )}
          </Box>
        </>
      )}

      <StockDetailModal 
        open={!!selectedStock} 
        onClose={() => setSelectedStock(null)} 
        stock={selectedStock} 
      />
      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
