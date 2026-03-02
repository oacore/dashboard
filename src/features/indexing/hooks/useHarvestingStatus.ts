import useSWR from 'swr';
import { fetcher, createSWRKey } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useCallback } from 'react';
import type { HarvestingStatus } from '../types';

export const useHarvestingStatus = (refresh = false, dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id;

  const buildUrl = useCallback(() => {
    if (!effectiveDataProviderId) return null;

    const baseUrl = `/internal/data-providers/${effectiveDataProviderId}/harvesting`;

    if (refresh) {
      return createSWRKey(baseUrl, { refresh: 'true' });
    }

    return baseUrl;
  }, [effectiveDataProviderId, refresh]);

  const key = (isLoaded && effectiveDataProviderId) ? buildUrl() : null;

  const { data, error, isLoading, mutate } = useSWR<HarvestingStatus>(
    key,
    key ? () => fetcher(key, true).then(res => res as HarvestingStatus) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: refresh ? 0 : 60000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      keepPreviousData: true,
    }
  );

  const refreshData = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    harvestingStatus: data || null,
    harvestingError: !!error,
    isLoading: isLoading || !isLoaded,
    mutate: refreshData,
    error,
  };
};

