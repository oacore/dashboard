import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { useMemo } from 'react';

export interface DepositTimeLagItem {
  depositTimeLag: number;
  worksCount: number;
}

interface AxiosError {
  response?: {
    status?: number;
  };
}

const is404Error = (err: unknown): boolean => {
  const axiosError = err as AxiosError;
  return axiosError?.response?.status === 404;
};

const extractDatePart = (dateTimeString: string): string => {
  return dateTimeString.split(' ')[0];
};

const buildDepositTimeLagUrl = (
  dataProviderId: number,
  startDate?: string,
  endDate?: string,
  setSpec?: string | null
): string => {
  const baseUrl = `/internal/data-providers/${dataProviderId}/statistics/deposit-time-lag`;
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

export const useDepositTimeLag = () => {
  const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
  const { dateRange } = useDepositDatesStore();

  const swrKey = useMemo(() => {
    if (!selectedDataProvider?.id || !isLoaded) {
      return null;
    }

    return buildDepositTimeLagUrl(
      selectedDataProvider.id,
      dateRange.startDate,
      dateRange.endDate,
      selectedSetSpec
    );
  }, [selectedDataProvider?.id, isLoaded, dateRange.startDate, dateRange.endDate, selectedSetSpec]);

  const { data, error, isLoading, mutate } = useSWR<DepositTimeLagItem[]>(
    swrKey,
    swrKey ? () => fetcher(swrKey).then((res) => res as DepositTimeLagItem[]) : null,
    {
      ...swrDefaultConfig,
      keepPreviousData: true,
      onError: (err) => {
        // Handle 404 (NotFoundError) silently as per original code
        if (!is404Error(err)) {
          console.error('Error fetching deposit time lag:', err);
        }
      },
    }
  );

  const isError = useMemo(() => {
    return !!error && !is404Error(error);
  }, [error]);

  const isEmpty = useMemo(() => {
    return !isLoading && (!error || is404Error(error)) && (!data || data.length === 0);
  }, [isLoading, error, data]);

  return {
    timeLagData: data || [],
    isLoading,
    error,
    mutate,
    isError,
    isEmpty,
  };
};
