'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
  initialData: T;
  refreshIntervalMs?: number;
  autoFetch?: boolean;
}

interface UseFetchResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T>>;
}

/** 
 * Generic data-fetching hook with auto-refresh and cleanup. 
 * Can be used for any endpoint that returns JSON.
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T>
): UseFetchResult<T> {
  const { initialData, refreshIntervalMs, autoFetch = true } = options;
  const [data, setData] = useState<T>(initialData);
  // If autoFetch is false, we shouldn't start in a loading state. Default to true.
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Veriler çekilirken bir hata oluştu');
      }
      const json = await response.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const initialFetch = async () => {
       await fetchData();
    };

    if (autoFetch) {
      initialFetch();
    }
    
    let interval: NodeJS.Timeout;
    if (refreshIntervalMs && refreshIntervalMs > 0) {
      interval = setInterval(fetchData, refreshIntervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [fetchData, refreshIntervalMs, autoFetch]);

  return { data, loading, error, refresh: fetchData, setData };
}
