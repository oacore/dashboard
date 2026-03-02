import useSWR from 'swr';
import { fetcher, createSWRKey } from '@/config/swr';

export const useWorkData = (workId?: string | number) => {
  const key = workId ? createSWRKey(`/v3/works/${workId}`) : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetcher(key!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
    }
  );

  return {
    workData: data,
    error,
    isLoading,
    refresh: () => mutate(),
  };
};
