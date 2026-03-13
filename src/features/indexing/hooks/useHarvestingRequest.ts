import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import { postRequestFetcher } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';

export interface HarvestingRequestResponse {
    [key: string]: unknown;
}

export const useHarvestingRequest = () => {
    const { selectedDataProvider } = useDataProviderStore();

    const { data, error, isMutating, trigger, reset } = useSWRMutation(
        'harvesting/request',
        async (
            _key: string,
            { arg }: { arg: { dataProviderId: number; message: string } }
        ) => {
            const url = `/internal/data-providers/${arg.dataProviderId}/harvesting/request`;
            return (await postRequestFetcher(url, { message: arg.message }, true)) as HarvestingRequestResponse;
        }
    );

    const sendHarvestingRequest = useCallback(
        (message: string) => {
            const dataProviderId = selectedDataProvider?.id;
            if (!dataProviderId) {
                throw new Error('No data provider selected');
            }
            return trigger({ dataProviderId, message });
        },
        [selectedDataProvider?.id, trigger]
    );

    return {
        sendHarvestingRequest,
        responseData: data ?? null,
        isLoading: isMutating,
        error: error ?? null,
        resetResponse: reset,
    };
};
