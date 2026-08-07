import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { IssuesAggregation } from '../types';

const SKIPPED_ISSUE_TYPES = new Set(['UNSPECIFIED_DOWNLOAD_ERROR']);

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

  const aggregation = useMemo<IssuesAggregation | null>(() => {
    if (!data) return null;

    const countByType = data.countByType ?? {};
    const filteredCountByType = Object.fromEntries(
      Object.entries(countByType).filter(([type]) => !SKIPPED_ISSUE_TYPES.has(type))
    );
    const skippedIssuesCount = Object.entries(countByType).reduce(
      (total, [type, count]) => total + (SKIPPED_ISSUE_TYPES.has(type) ? count : 0),
      0
    );

    return {
      ...data,
      countByType: filteredCountByType,
      typesCount: Object.values(filteredCountByType).filter((count) => count > 0).length,
      globalsCount: Math.max((data.globalsCount ?? 0) - skippedIssuesCount, 0),
    };
  }, [data]);

  const getDownloadUrl = useCallback((type: string): string | undefined => {
    if (!selectedDataProvider?.id) return undefined;
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    return `${baseUrl}/internal/data-providers/${selectedDataProvider.id}/issues?type=${type}&accept=text/csv`;
  }, [selectedDataProvider?.id]);

  const issuesByType = useMemo<Record<string, number>>(() => aggregation?.countByType ?? {}, [aggregation?.countByType]);

  return {
    aggregation,
    aggregationError: !!error,
    isLoading: isLoading || !isLoaded,
    mutate,
    error,
    issuesByType,
    typesCount: aggregation?.typesCount ?? 0,
    globalsCount: aggregation?.globalsCount ?? 0,
    getDownloadUrl,
  };
};
