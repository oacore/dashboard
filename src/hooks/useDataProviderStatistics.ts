import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { DataProviderStatistics } from '@features/Doi/types/statistics.types.ts';

/**
 * Hook to fetch data provider statistics
 * Fetches from /v3 (uses API key auth via axios interceptor)
 */
export const useDataProviderStatistics = (
    dataProviderId: number | null,
    setSelectedItem?: string | null
) => {
    const { isLoaded, setStatistics } = useDataProviderStore();
    const prevDataProviderIdRef = useRef<number | null>(null);

    // Build the key with query parameters
    const key = (isLoaded && dataProviderId)
        ? createSWRKey(
            `/v3/data-providers/${dataProviderId}/stats`,
            {
                depositHistory: 'true',
                ...(setSelectedItem && { set: setSelectedItem })
            }
        )
        : null;

    const { data, error, isLoading, mutate } = useSWR<DataProviderStatistics>(
        key,
        () => fetcher(key!).then((res) => res as DataProviderStatistics),
        {
            ...swrDefaultConfig,
            onError: () => {
                // Silently fail - ignore errors as per original code
            },
        }
    );

    // Clear statistics when data provider changes - prevents showing stale stats from previous provider
    useEffect(() => {
        if (prevDataProviderIdRef.current !== dataProviderId) {
            prevDataProviderIdRef.current = dataProviderId;
            setStatistics(null);
        }
    }, [dataProviderId, setStatistics]);

    // Sync store with SWR data (handles both cache and fetch - onSuccess does not fire for cached data)
    useEffect(() => {
        if (data != null && dataProviderId != null) {
            setStatistics(data);
        }
    }, [data, dataProviderId, setStatistics]);

    return {
        statistics: data ?? null,
        error,
        isLoading: isLoading || !isLoaded,
        mutate,
    };
};
