import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';

export interface HarvestingRequestResponse {
    [key: string]: unknown;
}

export const useHarvestingRequest = () => {
    const { selectedDataProvider } = useDataProviderStore();
    const [requestKey, setRequestKey] = useState<string | null>(null);
    const [requestBody, setRequestBody] = useState<{ message: string } | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    const key = requestKey && requestBody && selectedDataProvider?.id && shouldFetch
        ? `/internal/data-providers/${selectedDataProvider.id}/harvesting/request`
        : null;

    const { data, error, isLoading, mutate } = useSWR<HarvestingRequestResponse>(
        key,
        key && requestBody ? () => postRequestFetcher(key, requestBody, true).then(res => res as HarvestingRequestResponse) : null,
        swrDefaultConfig,
    );

    const sendHarvestingRequest = useCallback((message: string) => {
        const dataProviderId = selectedDataProvider?.id;

        if (!dataProviderId) {
            throw new Error('No data provider selected');
        }

        setRequestBody({ message });
        setRequestKey(`harvesting-request-${Date.now()}`);
        setShouldFetch(true);
    }, [selectedDataProvider?.id]);

    const resetResponse = useCallback(() => {
        setRequestKey(null);
        setRequestBody(null);
        setShouldFetch(false);
        mutate(undefined, { revalidate: false });
    }, [mutate]);

    return {
        sendHarvestingRequest,
        responseData: data || null,
        isLoading,
        error,
        resetResponse,
    };
};

