'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseStocksResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Generic data-fetching hook with auto-refresh and cleanup. */
export function useStocks<T = unknown>(
  url: string,
  refreshIntervalMs = 5 * 60 * 1000,
): UseStocksResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Veriler gelirken bir hata oluştu');
      }
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [fetchData, refreshIntervalMs]);

  return { data, loading, error, refresh: fetchData };
}
