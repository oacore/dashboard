import useSWR from 'swr';
import { createSWRKey } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { useMemo } from 'react';
import { http, API } from '@config/axios';
import axios from 'axios';

export interface CrossDepositLagData {
  nonCompliantCount: number;
  resultCount: number;
  bonusCount: number;
  possibleBonusCount?: number;
  error?: Error | null;
}

export class PaymentRequiredError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PaymentRequiredError';
  }
}

const extractDatePart = (dateTimeString: string): string => {
  return dateTimeString.split(' ')[0];
};

const buildCrossDepositLagUrl = (
  dataProviderId: number,
  startDate?: string,
  endDate?: string,
  setSpec?: string | null
): string => {
  const baseUrl = `/internal/data-providers/${dataProviderId}/cross-deposit-lag`;
  const params: Record<string, string> = {
    wait: 'true',
  };

  if (startDate && endDate) {
    params.fromDate = extractDatePart(startDate);
    params.toDate = extractDatePart(endDate);
  }

  if (setSpec) {
    params.set = setSpec;
  }

  return createSWRKey(baseUrl, params);
};

const buildCrossDepositLagCsvUrl = (baseUrl: string): string => {
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL || '';
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${apiUrl}${baseUrl}${separator}accept=text/csv`;
};

export const useCrossDepositLag = () => {
  const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
  const { dateRange } = useDepositDatesStore();

  const swrKey = useMemo(() => {
    if (!selectedDataProvider?.id || !isLoaded) {
      return null;
    }

    return buildCrossDepositLagUrl(
      selectedDataProvider.id,
      dateRange.startDate,
      dateRange.endDate,
      selectedSetSpec
    );
  }, [selectedDataProvider?.id, isLoaded, dateRange.startDate, dateRange.endDate, selectedSetSpec]);

  const { data, error, isLoading, mutate } = useSWR<CrossDepositLagData>(
    swrKey,
    swrKey
      ? async () => {
        try {
          const response = await http.get(swrKey);

          // Use data only if status is 200 OK
          // Ignore body if got 202 Accepted
          const { status } = response;
          const responseData: Partial<CrossDepositLagData> =
            status === 200 || status === 0 ? (response.data as Partial<CrossDepositLagData>) : {};

          // Build CSV URL and check availability with HEAD request
          let csvError: Error | null = null;
          const csvUrl = buildCrossDepositLagCsvUrl(swrKey);

          try {
            // Extract path from full URL for API.head
            const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL || '';
            const csvPath = csvUrl.replace(apiBaseUrl, '');
            await API.head(csvPath);
          } catch (err) {
            if (axios.isAxiosError(err)) {
              const errorStatus = err.response?.status;
              if (errorStatus === 402) {
                csvError = new PaymentRequiredError('Payment required');
              } else if (errorStatus !== 404) {
                // Only set error for non-404 statuses (404 might mean no data to export)
                csvError = err as Error;
              }
            } else {
              csvError = err as Error;
            }
          }

          // Clean the error up if we have no data to export
          // This prevents showing the message when there is nothing to sell
          if (
            csvError instanceof PaymentRequiredError &&
            !responseData.possibleBonusCount
          ) {
            csvError = null;
          }

          return {
            ...responseData,
            error: csvError,
          } as CrossDepositLagData;
        } catch (err) {
          console.error('Error fetching cross deposit lag:', err);
          throw err;
        }
      }
      : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
      shouldRetryOnError: true,
      errorRetryCount: 3,
      keepPreviousData: true,
      onError: (err) => {
        console.error('SWR Error fetching cross deposit lag:', err);
      },
    }
  );

  const csvUrl = useMemo(() => {
    if (!swrKey) return null;
    return buildCrossDepositLagCsvUrl(swrKey);
  }, [swrKey]);

  return {
    crossDepositLag: data || null,
    crossDepositLagCsvUrl: csvUrl || null,
    isLoading,
    error,
    mutate,
  };
};
