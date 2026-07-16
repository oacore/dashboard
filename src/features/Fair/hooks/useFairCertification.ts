import useSWR from 'swr';
import { fetcher, putRequest, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { FairCertificationApiResponse } from '@features/Fair/types/fairCertification.types';

export const useFairCertification = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/internal/data-providers/${effectiveDataProviderId}/fair-certification`
      : null;

  const { data, error, isLoading, mutate } = useSWR<FairCertificationApiResponse>(
    key,
    key ? () => fetcher(key).then((res) => res as FairCertificationApiResponse) : null,
    swrDefaultConfig,
  );

  return {
    fairCertification: data ?? null,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};

export const updateFairCertificationAnswer = (
  dataProviderId: number,
  questionId: string,
  answer: string,
) =>
  putRequest(
    `/internal/data-providers/${dataProviderId}/fair-certification/answers/${questionId}`,
    { answer },
  );
