import useSWR from 'swr';
import { createSWRKey, fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { DoiData } from '@features/Doi/types/data.types';

export const useDoiData = (
    dataProviderId?: number,
    from: number = 0,
    size: number = 100,
    searchTerm: string = ''
) => {
    const { isLoaded, selectedSetSpec } = useDataProviderStore();
    const providerId = dataProviderId ?? 1;

    const params: Record<string, string | number> = { from, size };
    if (selectedSetSpec) {
        params.set = selectedSetSpec;
    }
    if (searchTerm.trim()) {
        params.q = searchTerm.trim();
    }

    const key = (isLoaded && providerId)
        ? createSWRKey(`/internal/data-providers/${providerId}/doi`, params)
        : null;

    const { data, error, isLoading, mutate } = useSWR<DoiData[]>(
        key,
        () => fetcher(key!).then((res) => res as DoiData[]),
        swrDefaultConfig,
    );

    const errorMessage = error instanceof Error ? error.message : error ? 'Failed to fetch DOI data' : null;

    return {
        data: data || [],
        count: data?.length || 0,
        errorMessage,
        isLoading: isLoading || !isLoaded,
        mutate,
    };
};
