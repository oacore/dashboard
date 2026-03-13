import useSWR from 'swr';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import type { RioxxStats } from '../types/index';
import { useDataProviderStore } from '@/store/dataProviderStore';

interface RioxxAggregationResponse {
  compliantRecordBasic: number;
  compliantRecordFull: number;
  totalRecords: number;
  missingTermsBasic?: Array<{ elementName: string; outputsCount: number }>;
  [key: string]: unknown;
}

export const useRioxxStats = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id;

  const key = (isLoaded && effectiveDataProviderId)
    ? `/internal/data-providers/${effectiveDataProviderId}/rioxx/aggregation`
    : null;

  const { data, error, isLoading, mutate } = useSWR<RioxxAggregationResponse>(
    key,
    key ? () => fetcher(key, true).then(res => res as RioxxAggregationResponse) : null,
    {
      ...swrDefaultConfig,
      onError: () => {
        // Ignore errors for this moment (as per original implementation)
      },
    }
  );

  // Transform the data to match the expected structure
  const rioxxStats: RioxxStats | null = data ? {
    partiallyCompliantCount: data.compliantRecordBasic || 0,
    compliantCount: data.compliantRecordFull || 0,
    totalCount: data.totalRecords || 0,
    missingTermsBasic: data.missingTermsBasic || [],
    ...Object.fromEntries(
      Object.entries(data).filter(([key]) => 
        !['compliantRecordBasic', 'compliantRecordFull', 'totalRecords', 'missingTermsBasic'].includes(key)
      )
    ),
  } : null;

  return {
    rioxx: rioxxStats,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
    isError: !!error,
  };
};

