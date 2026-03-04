import useSWR from 'swr';
import { fetcher, postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import type { RrsData } from '@features/Rrs-policy/types/data.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

// Hook for fetching RRS list data
export const useRrsData = (dataProviderId: number) => {
    const { isLoaded, selectedSetSpec } = useDataProviderStore();

    const key = (isLoaded && dataProviderId)
        ? `/internal/data-providers/${dataProviderId}/rights-retention${selectedSetSpec ? `?set=${selectedSetSpec}` : ''}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<RrsData[]>(
        key,
        () => fetcher(key!).then(res => res as RrsData[]),
        swrDefaultConfig,
    );

    return {
        data: data || [],
        error,
        isLoading: isLoading || !isLoaded,
        mutate
    };
};

export const updateRrsStatus = (
    dataProviderId: number,
    articleId: string,
    validationStatus: number
) => {
    const url = `/internal/data-providers/${dataProviderId}/rights-retention-update`;
    const body = { articleId, validationStatus };

    return postRequestFetcher(url, body);
};
