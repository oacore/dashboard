import useSWR from 'swr';
import { fetcher } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useCallback, useMemo } from 'react';
import type { IssuesAggregation } from '../types';

export const useIssuesAggregation = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id;

  const key = (isLoaded && effectiveDataProviderId)
    ? `/internal/data-providers/${effectiveDataProviderId}/issues/aggregation`
    : null;

  const { data, error, isLoading, mutate } = useSWR<IssuesAggregation>(
    key,
    key ? () => fetcher(key, true).then(res => res as IssuesAggregation) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      keepPreviousData: true,
    }
  );

  const refreshData = useCallback(() => {
    return mutate();
  }, [mutate]);

  const issuesByType = useMemo<Record<string, number>>(() => {
    if (!data?.countByType) {
      return {};
    }
    return data.countByType;
  }, [data]);

  const getDownloadUrl = useCallback((type: string): string | undefined => {
    if (!selectedDataProvider?.id) return undefined;
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    return `${baseUrl}/internal/data-providers/${selectedDataProvider.id}/issues?type=${type}&accept=text/csv`;
  }, [selectedDataProvider?.id]);

  return {
    aggregation: data || null,
    aggregationError: !!error,
    isLoading: isLoading || !isLoaded,
    mutate: refreshData,
    error,
    issuesByType,
    typesCount: data?.typesCount ?? 0,
    globalsCount: data?.globalsCount ?? 0,
    getDownloadUrl,
  };
};

