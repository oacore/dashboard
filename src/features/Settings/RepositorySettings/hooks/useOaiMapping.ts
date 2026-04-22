import { useCallback } from 'react';
import useSWR from 'swr';
import { fetcher, patchRequest, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { message } from 'antd';
import { captureHandledError } from '@/utils/captureHandledError';

interface OaiMappingData {
  oaiPrefix?: string;
  urlMapping?: string;
  activated?: boolean;
  [key: string]: unknown;
}

export const useOaiMapping = () => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;

  const key = (isLoaded && dataProviderId)
    ? `/internal/data-providers/${dataProviderId}/oairesolver/settings`
    : null;

  const { data, error, isLoading, mutate } = useSWR<OaiMappingData>(
    key,
    key
      ? () =>
          fetcher(key)
            .then((res) => res as OaiMappingData)
            .catch((err) => {
              captureHandledError(err, {
                tags: { feature: 'settings', action: 'oai_mapping_fetch' },
                extra: { dataProviderId },
              });
              return {};
            })
      : null,
    {
      ...swrDefaultConfig,
      onError: () => {
        // Ignore errors silently as per original implementation
      },
    }
  );

  const updateOaiSettings = useCallback(
    async (body: Partial<OaiMappingData>): Promise<{ type: 'success' | 'danger'; message: string }> => {
      if (!dataProviderId) {
        const errorMessage = 'Data provider not found';
        message.error(errorMessage);
        return {
          type: 'danger',
          message: errorMessage,
        };
      }

      try {
        const url = `/internal/data-providers/${dataProviderId}/oairesolver/settings`;
        const updateData = {
          ...body,
          activated: Boolean(body.activated) || false,
        };

        // Optimistically update the cache
        const optimisticData: OaiMappingData | undefined = data
          ? { ...data, ...updateData }
          : undefined;

        await mutate(optimisticData, false);
        await patchRequest(url, updateData, true);
        // await mutate();

        return {
          type: 'success',
          message: 'Settings were updated successfully!',
        };
      } catch (error) {
        console.error('Error updating OAI settings:', error);
        captureHandledError(error, {
          tags: { feature: 'settings', action: 'oai_mapping_update' },
          extra: { dataProviderId },
        });
        // Revalidate to get the correct data on error
        await mutate();
        return {
          type: 'danger',
          message: 'Something went wrong. Please try it again later!',
        };
      }
    },
    [dataProviderId, mutate, data]
  );

  return {
    oaiMapping: data || {},
    isLoading: isLoading || !isLoaded, // Show loading while data providers are loading
    error,
    updateOaiSettings,
    mutate,
  };
};

