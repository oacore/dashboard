import useSWR from 'swr';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';

export interface IrusStats {
  [key: string]: unknown;
}

export const useIrusStats = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id ?? null;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/data-providers/${effectiveDataProviderId}/irus`
      : null;

  const { data, error, isLoading, mutate } = useSWR<IrusStats>(
    key,
    key ? () => fetcher(key).then((res) => res as IrusStats) : null,
    {
      ...swrDefaultConfig,
      onError: () => {
        // Ignore errors (as per original implementation)
      },
    }
  );

  return {
    irus: data ?? null,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};
