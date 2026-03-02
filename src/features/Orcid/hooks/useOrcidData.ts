import useSWR from 'swr';
import { fetcher } from '@/config/swr';
import type { OrcidData, OrcidStats } from '@features/Orcid/types/data.types';
import { useState, useCallback } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';

const usePaginatedOrcidData = (
  endpoint: string,
  statsKey: keyof OrcidStats,
  pageSize = 50,
  searchTerm = '',
  dataProviderId = 0
) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id || 0;

  const [from, setFrom] = useState(0);
  const [allData, setAllData] = useState<OrcidData[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState(searchTerm);
  const [lastDataProviderId, setLastDataProviderId] = useState(effectiveDataProviderId);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (searchTerm !== lastSearchTerm || effectiveDataProviderId !== lastDataProviderId) {
    setFrom(0);
    setAllData([]);
    setLastSearchTerm(searchTerm);
    setLastDataProviderId(effectiveDataProviderId);
    setIsLoadingMore(false);
  }

  const buildUrl = (from: number) => {
    const baseUrl = `/internal/data-providers/${effectiveDataProviderId}/${endpoint}`;
    const params = new URLSearchParams({
      from: from.toString(),
      size: pageSize.toString(),
    });

    if (searchTerm.trim()) {
      params.append('q', searchTerm.trim());
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const key = (isLoaded && effectiveDataProviderId) ? buildUrl(from) : null;

  const { error, isLoading, mutate } = useSWR<OrcidData[]>(
    key,
    () => fetcher(key!).then(res => res as OrcidData[]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
      onSuccess: (data) => {
        if (!data || data.length === 0) return;

        setAllData(prev => {
          if (from === 0) return data;
          return [...prev, ...data];
        });

        setIsLoadingMore(false);
      },
      onError: () => {
        setIsLoadingMore(false);
      }
    },
  );

  // Get stats
  const { stats } = useOrcidStats(effectiveDataProviderId);
  const totalLength = stats?.[statsKey] || 0;

  // Load more function
  const loadMore = useCallback(() => {
    if (allData.length >= totalLength || isLoadingMore) return;
    setIsLoadingMore(true);
    setFrom(allData.length);
  }, [allData.length, totalLength, isLoadingMore]);

  const finalData = error ? [] : allData;

  // Determine if this is initial load (no data yet and loading)
  const isInitialLoad = from === 0 && allData.length === 0;

  return {
    data: finalData,
    error,
    isLoading: isInitialLoad && (isLoading || !isLoaded), // Only show table loading for initial load
    isLoadingMore: isLoadingMore && isLoading, // Show button loading for load more
    mutate,
    loadMore,
    totalLength,
    hasMore: finalData.length < totalLength && !error,
    isInitialLoad,
  };
};

// Specific hooks using the generic one
export const useBasicOrcidData = (pageSize = 50, searchTerm = '', dataProviderId = 0) => {
  return usePaginatedOrcidData('orcid/basic', 'basic', pageSize, searchTerm, dataProviderId);
};

export const useOtherOrcidData = (pageSize = 50, searchTerm = '', dataProviderId = 0) => {
  return usePaginatedOrcidData('orcid/other-repos', 'fromOtherRepositories', pageSize, searchTerm, dataProviderId);
};

// Hook for fetching Orcid stats (unchanged)
export const useOrcidStats = (dataProviderId: number) => {
  const { isLoaded } = useDataProviderStore();

  const key = (isLoaded && dataProviderId) ? `/internal/data-providers/${dataProviderId}/orcid/stats` : null;

  const { data, error, isLoading, mutate } = useSWR<OrcidStats>(
    key,
    () => fetcher(key!).then(res => res as OrcidStats),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false, // Don't revalidate when navigating back to page
      revalidateOnReconnect: false, // Don't revalidate on network reconnect
    },
  );

  return {
    stats: data || { basic: 0, fromOtherRepositories: 0 },
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};
