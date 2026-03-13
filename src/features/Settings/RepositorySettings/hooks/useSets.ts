import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { fetcher, patchRequest, deleteRequest, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { message } from 'antd';

export interface SetItem {
  id?: number;
  setName: string;
  setSpec: string;
  setNameDisplay?: string;
  [key: string]: unknown;
}

export interface EnableSetBody {
  providerId?: number;
  id?: number;
  setSpec: string;
  setName: string;
  setNameDisplay?: string;
}

const ENABLED_SETS_SWR_KEY = (dataProviderId: number) =>
  `/internal/data-providers/${dataProviderId}/set`;
const AVAILABLE_SETS_SWR_KEY = (dataProviderId: number) =>
  `/internal/data-providers/${dataProviderId}/set/available`;

export const useSets = () => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;

  const [shouldFetchAvailable, setShouldFetchAvailable] = useState(false);

  const enabledKey =
    isLoaded && dataProviderId ? ENABLED_SETS_SWR_KEY(dataProviderId) : null;
  const availableKey =
    isLoaded && dataProviderId && shouldFetchAvailable
      ? AVAILABLE_SETS_SWR_KEY(dataProviderId)
      : null;

  const {
    data: enabledList = [],
    isLoading: loadingSets,
    mutate: mutateEnabled,
  } = useSWR<SetItem[]>(
    enabledKey,
    enabledKey ? () => fetcher(enabledKey).then((res) => res as SetItem[]) : null,
    swrDefaultConfig,
  );

  const {
    data: wholeSetData = [],
    isLoading: loadingWholeSets,
    mutate: mutateAvailable,
  } = useSWR<SetItem[]>(
    availableKey,
    availableKey
      ? () => fetcher(availableKey).then((res) => res as SetItem[])
      : null,
    swrDefaultConfig,
  );

  const triggerFetchAvailable = useCallback(() => {
    setShouldFetchAvailable(true);
  }, []);

  const enableSet = useCallback(
    async (body: EnableSetBody): Promise<void> => {
      if (!dataProviderId) {
        message.error('Data provider not found');
        throw new Error('Data provider not found');
      }

      const url = `/internal/data-providers/${dataProviderId}/set/settings`;
      const requestBody = {
        ...body,
        providerId: body.providerId ?? dataProviderId,
      };

      await patchRequest(url, requestBody, true);
      await mutateEnabled();
      await mutateAvailable();
      message.success('Set enabled successfully');
    },
    [dataProviderId, mutateEnabled, mutateAvailable]
  );

  const deleteSet = useCallback(
    async (idSet: number): Promise<void> => {
      if (!dataProviderId) {
        message.error('Data provider not found');
        throw new Error('Data provider not found');
      }

      const url = `/internal/data-providers/${dataProviderId}/set/settings/${idSet}`;
      await deleteRequest(url, true);
      await mutateEnabled();
      await mutateAvailable();
      message.success('Set removed successfully');
    },
    [dataProviderId, mutateEnabled, mutateAvailable]
  );

  return {
    enabledList,
    wholeSetData,
    loadingSets: loadingSets || !isLoaded,
    loadingWholeSets,
    enableSet,
    deleteSet,
    triggerFetchAvailable,
    mutateEnabled,
    mutateAvailable,
    dataProviderId,
  };
};
