import { useEffect, useMemo } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import { useUserDataProviders } from '@hooks/useDataProviders';
import { useDataProviderById } from '@hooks/useDataProviderById';
import type { DataProvider } from '@hooks/useDataProviders';

export interface UseDashboardDataProviderSyncResult {
    dataProviders: DataProvider[];
    isLoading: boolean;
    isError: boolean;
    selectedDataProvider: DataProvider | null;
    selectedSetSpec: string | null;
    /** Resolved data provider ID from store or URL (for use before store sync completes). */
    effectiveDataProviderId: number | null;
}

/**
 * Syncs URL dataProviderId with store: fetches user data providers,
 * fetches by ID when provider is not in list, and sets selectedDataProvider.
 * Use in dashboard route context (MetadataRestrictedRoute, DashboardLayout).
 */
export const useDashboardDataProviderSync = (userId: string | null): UseDashboardDataProviderSyncResult => {
    const { dataProviderId: urlDataProviderId } = useDashboardRoute();
    const {
        selectedDataProvider,
        setSelectedDataProvider,
        addDataProvider,
        selectedSetSpec,
    } = useDataProviderStore();

    const { dataProviders, isLoading, isError } = useUserDataProviders(userId);

    const shouldFetchById =
        urlDataProviderId != null &&
        !isLoading &&
        !dataProviders.find((p) => p.id === urlDataProviderId);
    const { dataProvider: fetchedProvider } = useDataProviderById(
        urlDataProviderId,
        shouldFetchById
    );

    useEffect(() => {
        if (urlDataProviderId == null) return;
        const provider = dataProviders.find((p) => p.id === urlDataProviderId);
        if (provider) {
            setSelectedDataProvider(provider);
            return;
        }
        if (fetchedProvider) {
            addDataProvider(fetchedProvider);
            setSelectedDataProvider(fetchedProvider);
        }
    }, [
        urlDataProviderId,
        dataProviders,
        fetchedProvider,
        setSelectedDataProvider,
        addDataProvider,
    ]);

    const effectiveDataProviderId = selectedDataProvider?.id ?? urlDataProviderId ?? null;

    /** Include fetched provider so RepositorySelect can display name when navigating by URL. */
    const dataProvidersForSelect = useMemo(() => {
        if (!fetchedProvider || dataProviders.some((p) => p.id === fetchedProvider.id)) {
            return dataProviders;
        }
        return [...dataProviders, fetchedProvider];
    }, [dataProviders, fetchedProvider]);

    return {
        dataProviders: dataProvidersForSelect,
        isLoading,
        isError,
        selectedDataProvider,
        selectedSetSpec,
        effectiveDataProviderId,
    };
};
