import { useCallback, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { http } from '@/config/axios';
import { downloadFile } from '@/utils/downloadUtils';

export interface UseDownloadDataProviderCsvConfig {
    endpoint: string;
    filenamePrefix: string;
    mutationKey: string;
    pathBuilder?: (dataProviderId: number) => string;
}

const createDownloadCsvFetcher = (config: UseDownloadDataProviderCsvConfig) =>
    async (
        _key: string,
        { arg }: { arg: { dataProviderId: number } }
    ) => {
        const path = config.pathBuilder
            ? config.pathBuilder(arg.dataProviderId)
            : `/internal/data-providers/${arg.dataProviderId}/${config.endpoint}?accept=text/csv`;
        const response = await http.get<Blob>(path, {
            responseType: 'blob',
            withCredentials: true,
        });

        const blob = response.data;
        const blobUrl = URL.createObjectURL(blob);
        const filename = `${config.filenamePrefix}-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(blobUrl, filename);
        URL.revokeObjectURL(blobUrl);
    };

export const useDownloadDataProviderCsv = (config: UseDownloadDataProviderCsvConfig) => {
    const { selectedDataProvider } = useDataProviderStore();
    const fetcher = useMemo(
        () => createDownloadCsvFetcher(config),
        [config]
    );
    const { trigger, isMutating, error } = useSWRMutation(
        config.mutationKey,
        fetcher
    );

    const downloadCsv = useCallback(() => {
        const dataProviderId = selectedDataProvider?.id;
        if (!dataProviderId) {
            console.error('No data provider selected');
            return;
        }
        return trigger({ dataProviderId });
    }, [selectedDataProvider?.id, trigger]);

    return { downloadCsv, isLoading: isMutating, error: error ?? null };
};
