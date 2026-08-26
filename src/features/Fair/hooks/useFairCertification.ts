import { useCallback } from 'react';
import useSWR from 'swr';
import { fetcher, postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type {
  FairCertificationApiResponse,
  FairCertificationSubmissionsApiResponse,
} from '@features/Fair/types/fairCertification.types';

const fetchFairCertification = (url: string) =>
  fetcher(url, true, { bustCache: true }).then(
    (response) => response as FairCertificationApiResponse,
  );

let pendingAnswerSave: Promise<void> = Promise.resolve();

export const waitForPendingFairAnswerSaves = () => pendingAnswerSave;

export const useFairCertification = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/internal/data-providers/${effectiveDataProviderId}/fair-certification`
      : null;

  const { data, error, isLoading, mutate } = useSWR<FairCertificationApiResponse>(
    key,
    key ? () => fetchFairCertification(key) : null,
    swrDefaultConfig,
  );

  const saveAnswer = useCallback(
    async (questionId: string, answer: string) => {
      if (!effectiveDataProviderId) {
        throw new Error('Data provider not found');
      }

      const savePromise = (async () => {
        await updateFairCertificationAnswer(effectiveDataProviderId, questionId, answer);
        await mutate();
      })();

      pendingAnswerSave = Promise.all([pendingAnswerSave, savePromise]).then(() => undefined);
      await savePromise;
    },
    [effectiveDataProviderId, mutate],
  );

  return {
    fairCertification: data ?? null,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
    saveAnswer,
  };
};

export const updateFairCertificationAnswer = (
  dataProviderId: number,
  questionId: string,
  answer: string,
) =>
  postRequestFetcher(
    `/internal/data-providers/${dataProviderId}/fair-certification/answers/${questionId}`,
    { answer },
  );

export const submitFairCertification = (dataProviderId: number) =>
  postRequestFetcher(
    `/internal/data-providers/${dataProviderId}/fair-certification/submissions`,
    undefined,
    true,
  );

export const useFairCertificationSubmissions = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/internal/data-providers/${effectiveDataProviderId}/fair-certification/submissions`
      : null;

  const { data, error, isLoading, mutate } = useSWR<FairCertificationSubmissionsApiResponse>(
    key,
    key
      ? () =>
          fetcher(key).then(
            (response) => response as FairCertificationSubmissionsApiResponse,
          )
      : null,
    swrDefaultConfig,
  );

  return {
    submissions: data?.submissions ?? [],
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};
