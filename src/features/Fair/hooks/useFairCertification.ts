import useSWR from 'swr';
import { fetcher, postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { FairCertificationApiResponse } from '@features/Fair/types/fairCertification.types';

// TODO CHECK refresh
export const refreshFairCertificationAutomaticChecks = (dataProviderId: number) =>
  postRequestFetcher(
    `/internal/data-providers/${dataProviderId}/fair-certification/refresh`,
    undefined,
    true,
  );

const fetchFairCertification = async (
  url: string,
  dataProviderId: number,
): Promise<FairCertificationApiResponse> => {
  const response = (await fetcher(url)) as FairCertificationApiResponse;
  await refreshFairCertificationAutomaticChecks(dataProviderId);
  return response;
};

export const useFairCertification = (dataProviderId?: number) => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id;

  const key =
    isLoaded && effectiveDataProviderId
      ? `/internal/data-providers/${effectiveDataProviderId}/fair-certification`
      : null;

  const { data, error, isLoading, mutate } = useSWR<FairCertificationApiResponse>(
    key,
    key && effectiveDataProviderId
      ? () => fetchFairCertification(key, effectiveDataProviderId)
      : null,
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
