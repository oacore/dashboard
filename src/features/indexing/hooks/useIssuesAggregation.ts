import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { IssuesAggregation } from '../types';

export const useIssuesAggregation = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/internal/data-providers/${effectiveDataProviderId}/issues/aggregation`
      : null;

  const { data, error, isLoading, mutate } = useSWR<IssuesAggregation>(
    key,
    key ? () => fetcher(key, true).then((res) => res as IssuesAggregation) : null,
    { ...swrDefaultConfig, keepPreviousData: true }
  );

  const getDownloadUrl = useCallback((type: string): string | undefined => {
    if (!selectedDataProvider?.id) return undefined;
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    return `${baseUrl}/internal/data-providers/${selectedDataProvider.id}/issues?type=${type}&accept=text/csv`;
  }, [selectedDataProvider?.id]);

  const issuesByType = useMemo<Record<string, number>>(() => data?.countByType ?? {}, [data?.countByType]);

  return {
    aggregation: data ?? null,
    aggregationError: !!error,
    isLoading: isLoading || !isLoaded,
    mutate,
    error,
    issuesByType,
    typesCount: data?.typesCount ?? 0,
    globalsCount: data?.globalsCount ?? 0,
    getDownloadUrl,
  };
};

