'use client';

import React, { useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockGrid from '@/components/StockGrid';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { TrendingUp } from 'lucide-react';
import { Container } from '@mui/material';
import { useStocks } from '@/hooks/useStocks';
import { useStockFilter } from '@/hooks/useStockFilter';
import { BIST_30 } from '@/data/bist-indexes';

const BACKGROUND_ORBS = [
  { color: 'rgba(59, 130, 246, 0.05)', top: 80, left: 0 },
  { color: 'rgba(139, 92, 246, 0.05)', bottom: 0, right: 0, size: 384, blur: 150 },
];

export default function Bist30Page() {
  const { data: allStocks, loading, error } = useStocks<Stock>('/api/stocks');
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side filter to only show BIST 30 symbols
  const bist30Stocks = allStocks.filter((s) => BIST_30.includes(s.symbol));
  const { filteredStocks } = useStockFilter(bist30Stocks, searchQuery);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<TrendingUp color="#3b82f6" size={32} />}
        title="BİST 30 Piyasası"
        subtitle="Borsa İstanbul'da işlem gören, piyasa değeri ve işlem hacmi en yüksek 30 hisse senedinin anlık verileri."
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
          placeholder="BİST 30 listesinde hisse ara..."
        />
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
