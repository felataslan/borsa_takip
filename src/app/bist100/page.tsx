'use client';

import React, { useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockGrid from '@/components/StockGrid';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { Map } from 'lucide-react';
import { Container } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useStockFilter } from '@/hooks/useStockFilter';

const BACKGROUND_ORBS = [
  { color: 'rgba(147, 51, 234, 0.05)', top: 80, right: 0 },
  { color: 'rgba(34, 197, 94, 0.05)', bottom: 0, left: 0, size: 384, blur: 150 },
];

export default function Bist100Page() {
  const { data: allStocks, loading, error } = useFetch<Stock[]>('/api/stocks?index=BIST100', { initialData: [] });
  const [searchQuery, setSearchQuery] = useState('');

  const { filteredStocks } = useStockFilter(allStocks, searchQuery);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Map color="#9333ea" size={32} />}
        title="BİST 100 Piyasası"
        subtitle="Borsa İstanbul'un piyasa ve pazar göstergesi sayılan temel 100 hisse senedi listesi."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <StockGrid
          stocks={filteredStocks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="BİST 100 listesinde hisse ara..."
        />
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
