import { useState, useCallback } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { postRequestFetcher, createSWRKey } from '@config/swr.ts';
import { message } from 'antd';
import { useSWRConfig } from 'swr';
import type { DataProvider } from '@hooks/useDataProviders.ts';
import { useAuthStore } from '@/store/authStore.ts';

interface UpdateLogoBody {
  logoBase64: string | null;
}

export const useUpdateLogo = () => {
  const { selectedDataProvider, setSelectedDataProvider } = useDataProviderStore();
  const { user } = useAuthStore();
  const { mutate: globalMutate } = useSWRConfig();
  const [isUpdating, setIsUpdating] = useState(false);

  const dataProviderId = selectedDataProvider?.id;

  const updateLogo = useCallback(
    async (body: UpdateLogoBody): Promise<void> => {
      if (!dataProviderId) {
        const errorMsg = 'Data provider not found';
        message.error(errorMsg);
        return;
      }

      setIsUpdating(true);

      try {
        await postRequestFetcher(
          `/internal/data-providers/${dataProviderId}/settings`,
          body,
          true
        );

        // Optimistically update the selected data provider
        if (selectedDataProvider) {
          const updatedProvider: DataProvider = {
            ...selectedDataProvider,
            logoBase64: body.logoBase64 || '',
            logo: body.logoBase64 || selectedDataProvider.logoPath || undefined,
          };
          setSelectedDataProvider(updatedProvider);
        }

        // Also update the data providers list cache if available
        if (user?.id) {
          const dataProvidersKey = createSWRKey(`/internal/users/${user.id}/data-providers`);
          await globalMutate(
            dataProvidersKey,
            (current: DataProvider[] | undefined) => {
              if (!current) return current;
              return current.map((provider) =>
                provider.id === dataProviderId
                  ? {
                      ...provider,
                      logoBase64: body.logoBase64 || '',
                      logo: body.logoBase64 || provider.logoPath || undefined,
                    }
                  : provider
              );
            },
            { revalidate: false }
          );
        }

      } catch (error) {
        console.error('Error updating logo:', error);
        // Ignore errors for this moment (as per original implementation)
      } finally {
        setIsUpdating(false);
      }
    },
    [
      dataProviderId,
      selectedDataProvider,
      setSelectedDataProvider,
      globalMutate,
      user?.id,
    ]
  );

  return {
    updateLogo,
    isUpdating,
    logoUrl: selectedDataProvider?.logoBase64 || selectedDataProvider?.logoPath || undefined,
  };
};

