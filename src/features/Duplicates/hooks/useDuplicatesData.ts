import useSWR from 'swr';
import { fetcher, createSWRKey } from '@/config/swr';
import type { DuplicatesResponse, DuplicateData } from '@features/Duplicates/types/data.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

export const useDuplicatesData = (
    dataProviderId: number | null,
    refresh: boolean = false
) => {
    const { isLoaded, selectedSetSpec } = useDataProviderStore();

    const params: Record<string, string> = {};
    if (refresh) {
        params.refresh = 'true';
    }
    if (selectedSetSpec) {
        params.set = selectedSetSpec;
    }

    const baseUrl = `/internal/data-providers/${dataProviderId}/duplicates`;
    const key = (isLoaded && dataProviderId)
        ? createSWRKey(baseUrl, Object.keys(params).length > 0 ? params : undefined)
        : null;

    const { data, error, isLoading, mutate } = useSWR<DuplicatesResponse>(
        key,
        () => fetcher(key!).then(res => res as DuplicatesResponse),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false, // Don't revalidate when navigating back to page
            revalidateOnReconnect: false, // Don't revalidate on network reconnect
        },
    );

    return {
        data: data?.duplicateList ? Object.values(data.duplicateList) as DuplicateData[] : [],
        count: data?.count || 0,
        error,
        isLoading: isLoading || !isLoaded,
        mutate
    };
};
