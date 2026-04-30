import useSWR from 'swr';
import { createSWRKey, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { useMemo } from 'react';
import { http } from '@config/axios';
import { captureHandledError } from '@/utils/captureHandledError';

export interface PublicationDatesValidateData {
  fullCount: number;
  partialCount: number;
  noneCount: number;
}

const extractDatePart = (dateTimeString: string): string => {
  return dateTimeString.split(' ')[0];
};

const buildPublicationDatesValidateUrl = (
  dataProviderId: number,
  startDate?: string,
  endDate?: string,
  setSpec?: string | null
): string => {
  const baseUrl = `/internal/data-providers/${dataProviderId}/publication-dates-validate`;
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

export const usePublicationDatesValidate = () => {
  const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
  const { dateRange } = useDepositDatesStore();

  const swrKey = useMemo(() => {
    if (!selectedDataProvider?.id || !isLoaded) {
      return null;
    }

    return buildPublicationDatesValidateUrl(
      selectedDataProvider.id,
      dateRange.startDate,
      dateRange.endDate,
      selectedSetSpec
    );
  }, [
    selectedDataProvider?.id,
    isLoaded,
    dateRange.startDate,
    dateRange.endDate,
    selectedSetSpec,
  ]);

  const { data, error, isLoading, mutate } = useSWR<PublicationDatesValidateData>(
    swrKey,
    swrKey
      ? async () => {
        try {
          const response = await http.get<PublicationDatesValidateData>(swrKey);

          // Use data only if status is 200 OK
          // Ignore body if got 202 Accepted
          const { status } = response;
          const responseData: Partial<PublicationDatesValidateData> =
            status === 200 || status === 0
              ? (response.data as Partial<PublicationDatesValidateData>)
              : {};

          return {
            fullCount: responseData.fullCount ?? 0,
            partialCount: responseData.partialCount ?? 0,
            noneCount: responseData.noneCount ?? 0,
          } as PublicationDatesValidateData;
        } catch (err) {
          console.error('Error fetching publication dates validate:', err);
          captureHandledError(err, {
            tags: { feature: 'deposit_compliance', action: 'publication_dates_validate_fetch' },
          });
          throw err;
        }
      }
      : null,
    {
      ...swrDefaultConfig,
      keepPreviousData: true,
      onError: (err) => {
        console.error('SWR Error fetching publication dates validate:', err);
      },
    }
  );

  return {
    publicationDatesValidate: data || null,
    isLoading,
    error,
    mutate,
  };
};
