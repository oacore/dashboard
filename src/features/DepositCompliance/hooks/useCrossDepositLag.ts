import useSWR from 'swr';
import { createSWRKey, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { useMemo } from 'react';
import { http, API } from '@config/axios';
import axios from 'axios';
import { captureHandledError } from '@/utils/captureHandledError';

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

          // Check CSV availability with HEAD request
          let csvError: Error | null = null;
          const csvPath = swrKey + (swrKey.includes('?') ? '&' : '?') + 'accept=text/csv';

          try {
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
          captureHandledError(err, {
            tags: { feature: 'deposit_compliance', action: 'cross_deposit_lag_fetch' },
          });
          throw err;
        }
      }
      : null,
    {
      ...swrDefaultConfig,
      keepPreviousData: true,
      onError: (err) => {
        console.error('SWR Error fetching cross deposit lag:', err);
      },
    }
  );

  return {
    crossDepositLag: data || null,
    isLoading,
    error,
    mutate,
  };
};
