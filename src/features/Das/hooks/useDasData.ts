import useSWR from 'swr';
import { fetcher, postRequestFetcher } from '@/config/swr';
import type { DasData } from '@features/Das/types/data.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

export const useDasData = (dataProviderId: number) => {
    const { isLoaded, selectedSetSpec } = useDataProviderStore();

    const key = (isLoaded && dataProviderId)
        ? `/internal/data-providers/${dataProviderId}/data-access${selectedSetSpec ? `?set=${selectedSetSpec}` : ''}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<DasData[]>(
        key,
        () => fetcher(key!).then(res => res as DasData[]),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false, // Don't revalidate when navigating back to page
            revalidateOnReconnect: false, // Don't revalidate on network reconnect
        },
    );

    return {
        data: data || [],
        error,
        isLoading: isLoading || !isLoaded,
        mutate
    };
};

export const updateDasStatus = (
    dataProviderId: number,
    articleId: string,
    validationStatus: number
) => {
    const url = `/internal/data-providers/${dataProviderId}/data-access-update`;
    const body = { articleId, validationStatus };

    return postRequestFetcher(url, body);
};
