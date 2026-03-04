import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@/config/swr';

export const useWorkData = (workId?: string | number) => {
  const key = workId ? createSWRKey(`/v3/works/${workId}`) : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetcher(key!),
    swrDefaultConfig,
  );

  return {
    workData: data,
    error,
    isLoading,
    refresh: () => mutate(),
  };
};
