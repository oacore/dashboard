import { useCallback, useRef, useState } from 'react';
import { message } from 'antd';

import { postRequestFetcher } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';

import { useFreshFindsStore } from '../store/freshFindsStore';
import type { FreshFindsDepositPayload } from '../types/data.types';

export const useDepositFreshFind = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const updateWorkStatus = useFreshFindsStore((state) => state.updateWorkStatus);
  const [depositingWorkId, setDepositingWorkId] = useState<number | null>(null);
  const depositingWorkIdRef = useRef<number | null>(null);

  const depositWork = useCallback(
    async (workId: number) => {
      const dataProviderId = selectedDataProvider?.id;

      if (!dataProviderId) {
        message.error('No data provider selected');
        return;
      }

      if (depositingWorkIdRef.current != null) {
        return;
      }

      const payload: FreshFindsDepositPayload = {
        workId,
        confirm: true,
        includeFullText: 0,
      };

      depositingWorkIdRef.current = workId;
      setDepositingWorkId(workId);

      try {
        await postRequestFetcher(
          `/internal/fresh-finds/deposit/${dataProviderId}`,
          payload,
        );
        updateWorkStatus(workId, 'adding');
        message.success('Added to your repository');
      } catch (error) {
        captureHandledError(error, {
          tags: { feature: 'fresh-finds', action: 'deposit' },
          extra: { dataProviderId, workId },
        });
        message.error('Failed to add to repository');
      } finally {
        depositingWorkIdRef.current = null;
        setDepositingWorkId(null);
      }
    },
    [selectedDataProvider?.id, updateWorkStatus],
  );

  return {
    depositWork,
    depositingWorkId,
  };
};
