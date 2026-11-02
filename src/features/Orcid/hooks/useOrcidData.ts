import useSWR, { type SWRConfiguration } from 'swr';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import type { OrcidData, OrcidProcessingResponse, OrcidStats } from '@features/Orcid/types/data.types';
import { useState, useCallback } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import {
    EMPTY_ORCID_STATS,
    isOrcidProcessingResponse,
    isOrcidStats,
} from '@features/Orcid/utils/orcidResponse';

type OrcidListResponse = OrcidData[] | OrcidProcessingResponse;

const useOrcidSWR = <T,>(
  key: string | null,
  fetcherFn: () => Promise<T>,
  config?: SWRConfiguration<T>,
) => {
  const result = useSWR<T>(key, fetcherFn, {
    ...swrDefaultConfig,
    ...config,
  });

  return {
    ...result,
    isProcessing: isOrcidProcessingResponse(result.data),
  };
};

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

  const { error, isLoading, isProcessing, mutate } = useOrcidSWR<OrcidListResponse>(
    effectiveDataProviderId ? buildUrl(from) : null,
    () => fetcher(buildUrl(from)!).then(res => res as OrcidListResponse),
    {
      onSuccess: (data) => {
        if (isOrcidProcessingResponse(data) || !Array.isArray(data)) {
          if (from === 0) setAllData([]);
          setIsLoadingMore(false);
          return;
        }

        if (data.length === 0) {
          setIsLoadingMore(false);
          return;
        }

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
  const { stats, isProcessing: isStatsProcessing } = useOrcidStats(effectiveDataProviderId);
  const totalLength = isStatsProcessing ? 0 : (stats?.[statsKey] || 0);

  // Load more function
  const loadMore = useCallback(() => {
    if (allData.length >= totalLength || isLoadingMore) return;
    setIsLoadingMore(true);
    setFrom(allData.length);
  }, [allData.length, totalLength, isLoadingMore]);

  const safeData = Array.isArray(allData) ? allData : [];
  const finalData = error || isProcessing ? [] : safeData;

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
    hasMore: !isProcessing && !isStatsProcessing && finalData.length < totalLength && !error,
    isProcessing,
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

// Hook for fetching Orcid stats
export const useOrcidStats = (dataProviderId: number) => {
  const { isLoaded } = useDataProviderStore();

  const key = (isLoaded && dataProviderId) ? `/internal/data-providers/${dataProviderId}/orcid/stats` : null;

  const { data, error, isLoading, isProcessing, mutate } = useOrcidSWR<OrcidStats | OrcidProcessingResponse>(
    key,
    () => fetcher(key!).then(res => res as OrcidStats | OrcidProcessingResponse),
  );

  return {
    stats: isOrcidStats(data) ? data : EMPTY_ORCID_STATS,
    error,
    isLoading: isLoading || !isLoaded,
    isProcessing,
    mutate,
  };
};
