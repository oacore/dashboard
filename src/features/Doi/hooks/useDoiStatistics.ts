import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@config/swr.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import type {DoiStatistics} from '@features/Doi/types/statistics.types.ts';

export const useDoiStatistics = (
    dataProviderId: number | null,
    setSpec: string | null
) => {
    const { isLoaded, setDoiStatistics } = useDataProviderStore();

    const params = setSpec ? { set: setSpec } : undefined;
    const key = (isLoaded && dataProviderId)
        ? createSWRKey(`/internal/data-providers/${dataProviderId}/statistics/doi`, params)
        : null;

    const { data, error, isLoading, mutate } = useSWR<DoiStatistics>(
        key,
        () => fetcher(key!).then((res) => res as DoiStatistics),
        {
            ...swrDefaultConfig,
            onError: () => {
                // Ignore errors
            },
            onSuccess: (responseData) => {
                setDoiStatistics(responseData);
            },
        }
    );

    return {
        doiStatistics: data || null,
        error,
        isLoading: isLoading || !isLoaded,
        mutate,
    };
};
