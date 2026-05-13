import { useEffect } from 'react';
import useSWR from 'swr';

import { captureHandledError } from '@/utils/captureHandledError';
import { createSWRKey, fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
// TODO REMOVE
import { buildFreshFindsInternalUrl } from '../constants/freshFindsProdApi';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { normalizeFreshFindsResponse } from '../utils/normalizeFreshFindsResponse';

/**
 * Fetches fresh-finds for the current data provider and syncs into {@link useFreshFindsStore}
 * (same idea as MobX observable + action, using Zustand + SWR like USRN).
 */
export const useFreshFindsData = (dataProviderId?: number | null) => {
    const { isLoaded, selectedSetSpec } = useDataProviderStore();
    const { setFreshFindsData, setFreshFindsDataLoading } = useFreshFindsStore();

    const params: Record<string, string> = {};
    if (selectedSetSpec) {
        params.set = selectedSetSpec;
    }

    const key =
        isLoaded && dataProviderId != null
            ? createSWRKey(
                buildFreshFindsInternalUrl(dataProviderId),
                Object.keys(params).length > 0 ? params : undefined,
            )
            : null;

    const { data, error, isLoading, mutate } = useSWR<unknown>(key, () => fetcher(key!), {
        ...swrDefaultConfig,
        onError: (err) => {
            captureHandledError(err, {
                tags: { feature: 'fresh-finds', action: 'fetch' },
                extra: { dataProviderId },
            });
        },
    });

    useEffect(() => {
        if (dataProviderId == null) {
            setFreshFindsData([]);
        }
    }, [dataProviderId, setFreshFindsData]);

    useEffect(() => {
        setFreshFindsDataLoading(isLoading || !isLoaded);
    }, [isLoading, isLoaded, setFreshFindsDataLoading]);

    useEffect(() => {
        if (error != null) {
            setFreshFindsData([]);
            return;
        }
        if (data == null) {
            return;
        }
        setFreshFindsData(normalizeFreshFindsResponse(data));
    }, [data, error, setFreshFindsData]);

    return {
        data: data ?? null,
        freshFindsData: normalizeFreshFindsResponse(data ?? null),
        error,
        isLoading: isLoading || !isLoaded,
        mutate,
    };
};
