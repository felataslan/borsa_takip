'use client';

import useSWR, { SWRConfiguration } from 'swr';

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
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Veriler çekilirken bir hata oluştu');
  }
  return response.json();
};

/** 
 * Generic data-fetching hook powered by SWR.
 * Provides automatic revalidation on window focus, interval-based refresh,
 * and deduplication of concurrent requests for the same key.
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T>
): UseFetchResult<T> {
  const { initialData, refreshIntervalMs, autoFetch = true } = options;

  const swrConfig: SWRConfiguration = {
    fallbackData: initialData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Deduplicate requests within 5 seconds
    ...(refreshIntervalMs && refreshIntervalMs > 0 ? { refreshInterval: refreshIntervalMs } : {}),
  };

  // If autoFetch is false, pass null as key to disable fetching
  const { data, error, isLoading, mutate } = useSWR<T>(
    autoFetch ? url : null,
    fetcher,
    swrConfig,
  );

  return {
    data: data ?? initialData,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu') : null,
    refresh: async () => { await mutate(); },
  };
}
