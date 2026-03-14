'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from 'lucide-react';
import StockGrid from '@/components/StockGrid';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useStockFilter } from '@/hooks/useStockFilter';

export default function FavoritesTab() {
  const { favorites } = useFavoritesStore();
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const { filteredStocks: filteredFavorites } = useStockFilter(favorites, favSearchQuery);

  if (favorites.length === 0) {
    return (
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
    );
  }

  return (
    <StockGrid
      stocks={filteredFavorites}
      searchQuery={favSearchQuery}
      onSearchChange={setFavSearchQuery}
      placeholder="Favorilerim arasında ara..."
    />
  );
}
