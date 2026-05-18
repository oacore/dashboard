import { useMemo } from 'react';
import useSWR from 'swr';

import { createSWRKey, fetcher, swrDefaultConfig } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { buildFreshFindsInternalUrl } from '../constants/freshFindsProdApi';
import type { FreshFindsRecord } from '../types/data.types';
import { normalizeFreshFindsResponse } from '../utils/normalizeFreshFindsResponse';

export const useFreshFindsData = (dataProviderId?: number | null) => {
  const { isLoaded, selectedSetSpec } = useDataProviderStore();

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

  const records: FreshFindsRecord[] = useMemo(() => {
    if (dataProviderId == null || error != null) {
      return [];
    }
    if (data == null) {
      return [];
    }
    return normalizeFreshFindsResponse(data);
  }, [data, dataProviderId, error]);

  return {
    data: records,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};
