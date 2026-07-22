import { useCallback } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { patchRequest, } from '@config/swr';
import { message } from 'antd';
import { captureHandledError } from '@/utils/captureHandledError';

interface UpdateDataProviderResponse {
  type: 'success' | 'danger';
  message: string;
}

export const useUpdateDataProvider = () => {
  const {
    selectedDataProvider,
    setSelectedDataProvider,
    isUpdating,
    setUpdating,
  } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;

  const updateDataProvider = useCallback(
    async (body: Record<string, unknown>): Promise<UpdateDataProviderResponse> => {
      if (!dataProviderId) {
        const errorMessage = 'Data provider not found';
        message.error(errorMessage);
        return {
          type: 'danger',
          message: errorMessage,
        };
      }

      setUpdating(true);

      try {
        const url = `/internal/data-providers/${dataProviderId}`;

        // Check if this is an OAI PMH URL update
        if (body.fieldId === 'oaiPmhUrl') {
          await patchRequest(
            url,
            {
              fieldId: 'oaiPmhUrl',
              oaiPmhEndpoint: body.oaiPmhEndpoint,
            },
            true
          );

          return {
            type: 'success',
            message: 'Your request for changing OAI PMH URL has been successfully sent.',
          };
        }

        // Regular data provider update
        const requestBody = {
          ...body,
          ror_id: body.ror_id,
          rorName: body.rorName,
          name: body.name,
        };

        await patchRequest(url, requestBody, true);

        // Update local state optimistically using Object.assign pattern
        if (selectedDataProvider) {
          const existingRorData = selectedDataProvider.rorData;
          const updatedRorData: Record<string, unknown> = existingRorData
            ? { ...existingRorData }
            : {};
          if (requestBody.ror_id) {
            updatedRorData.rorId = requestBody.ror_id as string;
          }
          if (requestBody.rorName) {
            updatedRorData.rorName = requestBody.rorName as string;
          }
          const updatedProvider = Object.assign({}, selectedDataProvider, requestBody, {
            rorData: updatedRorData,
          });
          setSelectedDataProvider(updatedProvider);
        }

        return {
          type: 'success',
          message:
            'Settings were updated successfully! Be aware that it may take a few days for the changes to propagate across the whole of CORE data.',
        };
      } catch (error) {
        console.error('Error updating data provider:', error);
        captureHandledError(error, {
          tags: { feature: 'settings', action: 'update_data_provider' },
          extra: { dataProviderId },
        });
        return {
          type: 'danger',
          message: 'Something went wrong. Please try again later!',
        };
      } finally {
        setUpdating(false);
      }
    },
    [dataProviderId, selectedDataProvider, setSelectedDataProvider, setUpdating]
  );

  return {
    updateDataProvider,
    isUpdating,
  };
};
