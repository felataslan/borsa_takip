'use client';

import React, { useState } from 'react';
import StockGrid from '@/components/StockGrid';
import PageHeader from '@/components/PageHeader';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { Star } from 'lucide-react';
import { Container } from '@mui/material';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useStockFilter } from '@/hooks/useStockFilter';

const BACKGROUND_ORBS = [
  { color: 'rgba(234, 179, 8, 0.05)', top: 80, left: 0 },
  { color: 'rgba(249, 115, 22, 0.05)', bottom: 0, right: 0, size: 384, blur: 150 },
];

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredStocks } = useStockFilter(favorites, searchQuery);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Star color="#eab308" fill="#eab308" size={32} />}
        title="Favori Hisselerim"
        subtitle="Takip ettiğiniz BİST hisselerinin güncel performansları."
      />

      <StockGrid
        stocks={filteredStocks}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Favorilerim arasında ara..."
      />

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
