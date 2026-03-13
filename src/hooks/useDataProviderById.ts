import useSWR from 'swr';
import { createSWRKey, fetcher, swrDefaultConfig } from '@config/swr';
import type { DataProvider } from '@hooks/useDataProviders';

const normalizeDataProvider = (provider: DataProvider): DataProvider => ({
    ...provider,
    logo: provider.logoBase64 || provider.logoPath || undefined,
});

/**
 * Fetches a single data provider by ID from /internal/data-providers/{id}.
 * Use when the provider is not in the loaded dataProviders list (e.g. direct URL navigation).
 */
export const useDataProviderById = (
    dataProviderId: number | null,
    enabled: boolean
) => {
    const key =
        enabled && dataProviderId != null
            ? createSWRKey(`/internal/data-providers/${dataProviderId}`)
            : null;

    const { data, error, isLoading, mutate } = useSWR<DataProvider>(
        key,
        () =>
            fetcher(key!).then((res) =>
                normalizeDataProvider(res as DataProvider)
            ),
        swrDefaultConfig,
    );

    return {
        dataProvider: data ?? null,
        error,
        isLoading,
        mutate,
    };
};
