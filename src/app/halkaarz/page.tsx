'use client';

import React, { useState, useMemo } from 'react';
import { IPOStock } from '@/types/stock.types';
import { Rocket } from 'lucide-react';
import { Box, Container } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import IpoReturnChart from '@/components/IpoReturnChart';
import IpoStockCard from '@/components/IpoStockCard';
import { useFetch } from '@/hooks/useFetch';

const BACKGROUND_ORBS = [
  { color: 'rgba(236, 72, 153, 0.05)', top: 120, left: 40 },
  { color: 'rgba(59, 130, 246, 0.05)', bottom: 0, right: 0, size: 384, blur: 150 },
];

/**
 * Transforms raw API stock data (which may have partial IPO fields) into the
 * strongly-typed IPOStock shape used by this page.
 */
function toIPOStock(stock: Record<string, unknown>): IPOStock {
  const currentPrice =
    (stock.regularMarketPrice as number) ||
    (stock.price as number) ||
    (stock.ipoPrice as number) ||
    0;
  const ipoPrice = (stock.ipoPrice as number) || 0;
  const totalReturnPercent = ipoPrice > 0 ? ((currentPrice - ipoPrice) / ipoPrice) * 100 : 0;

  return {
    symbol: stock.symbol as string,
    shortName: (stock.shortName as string) || (stock.ipoName as string) || (stock.symbol as string),
    regularMarketPrice: currentPrice,
    regularMarketChangePercent: (stock.regularMarketChangePercent as number) || 0,
    regularMarketChange: 0,
    currency: 'TRY',
    ipoPrice,
    ipoDate: (stock.ipoDate as string) || 'Bilinmiyor',
    ipoName: (stock.ipoName as string) || (stock.shortName as string) || (stock.symbol as string),
    totalReturnPercent,
  };
}

export default function IposPage() {
  const { data: rawData, loading, error } = useFetch<Record<string, unknown>[]>(
    '/api/stocks?index=HALKAARZ',
    { initialData: [] }
  );

  const [userLots, setUserLots] = useState<Record<string, number>>({});

  const handleLotChange = (symbol: string, value: string) => {
    const parsed = parseInt(value, 10);
    setUserLots(prev => ({
      ...prev,
      [symbol]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  };

  const ipoStocks: IPOStock[] = useMemo(() => rawData.map(toIPOStock), [rawData]);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Rocket color="#ec4899" size={32} />}
        title="Yeni Halka Arzlar (Son 3 Ay)"
        subtitle="Borsa İstanbul'da yakın zamanda işlem görmeye başlayan hisselerin halka arz fiyatlarına göre anlık getiri oranları ve analizleri."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <IpoReturnChart stocks={ipoStocks} />

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              position: 'relative',
              zIndex: 10,
            }}
          >
            {ipoStocks.map((stock, idx) => (
              <IpoStockCard
                key={stock.symbol}
                stock={stock}
                index={idx}
                userLots={userLots[stock.symbol] || 0}
                onLotChange={handleLotChange}
              />
            ))}
          </Box>
        </>
      )}

      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
