'use client';

import { useMemo } from 'react';
import { Stock } from '@/types/stock.types';

interface UseStockFilterResult {
  filteredStocks: Stock[];
  sectors: string[];
}

/**
 * Filters a stock list by a search query and an optional sector.
 * All computation is memoized to avoid unnecessary re-renders.
 */
export function useStockFilter(
  stocks: Stock[],
  searchQuery: string,
  selectedSector = 'All',
): UseStockFilterResult {
  const sectors = useMemo(
    () => Array.from(new Set(stocks.map((s) => s.sector || 'Diğer'))).sort(),
    [stocks],
  );

  const filteredStocks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return stocks.filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(query) ||
        stock.shortName.toLowerCase().includes(query);
      const matchesSector =
        selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [stocks, searchQuery, selectedSector]);

  return { filteredStocks, sectors };
}
