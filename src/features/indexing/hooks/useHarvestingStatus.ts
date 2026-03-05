import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { HarvestingStatus } from '../types';

export const useHarvestingStatus = (refresh = false, dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? refresh
        ? createSWRKey(`/internal/data-providers/${effectiveDataProviderId}/harvesting`, { refresh: 'true' })
        : `/internal/data-providers/${effectiveDataProviderId}/harvesting`
      : null;

  const { data, error, isLoading, mutate } = useSWR<HarvestingStatus>(
    key,
    key ? () => fetcher(key, true).then((res) => res as HarvestingStatus) : null,
    { ...swrDefaultConfig, keepPreviousData: true }
  );

  return {
    harvestingStatus: data ?? null,
    harvestingError: !!error,
    isLoading: isLoading || !isLoaded,
    mutate,
    error,
  };
};

