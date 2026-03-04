import { useCallback } from 'react';
import useSWR from 'swr';
import { fetcher, postRequestFetcher, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { message } from 'antd';

interface LicencingData {
  licenseStrategy: boolean;
  [key: string]: unknown;
}

export const useLicencing = () => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;

  const key = (isLoaded && dataProviderId)
    ? `/internal/data-providers/${dataProviderId}/licencing`
    : null;

  const { data, error, isLoading, mutate } = useSWR<LicencingData>(
    key,
    key ? () => fetcher(key).then(res => res as LicencingData) : null,
    swrDefaultConfig,
  );

  const updateLicencing = useCallback(
    (licenseType: boolean): Promise<void> => {
      if (!dataProviderId) {
        message.error('Data provider not found');
        return Promise.reject(new Error('Data provider not found'));
      }

      const url = `/internal/data-providers/${dataProviderId}/licencing`;

      // Optimistically update the cache
      const optimisticData: LicencingData | undefined = data
        ? { ...data, licenseStrategy: licenseType }
        : undefined;

      return mutate(optimisticData, false)
        .then(() => postRequestFetcher(url, { licence: licenseType }, true))
        .then(() => {
          mutate();
          return Promise.resolve();
        })
        .catch((error) => {
          console.error('Error updating license:', error);
          message.error('Failed to update licensing preference');
          // Revalidate to get the correct data on error
          mutate();
          throw error;
        });
    },
    [dataProviderId, mutate, data]
  );

  return {
    licencingData: data,
    isLoading,
    error,
    updateLicencing,
    mutate,
  };
};

