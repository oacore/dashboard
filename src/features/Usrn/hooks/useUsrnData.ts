import { useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useUsrnStore, type UsrnData } from '../store/usrnStore';

export const useUsrnData = (dataProviderId?: number) => {
  const { isLoaded } = useDataProviderStore();
  const { setUsrnData, setError, setLoading } = useUsrnStore();

  const key = (isLoaded && dataProviderId)
    ? `/internal/data-providers/${dataProviderId}/usrn`
    : null;

  const { data, error, isLoading, mutate } = useSWR<UsrnData>(
    key,
    () => fetcher(key!).then((res) => res as UsrnData),
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
      onSuccess: (responseData) => {
        setUsrnData(responseData);
        setError(null);
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Failed to fetch USRN data';
        setUsrnData(null);
        setError(message);
      },
    }
  );

  useEffect(() => {
    setLoading(isLoading || !isLoaded);
  }, [isLoading, isLoaded, setLoading]);

  return {
    usrnData: data || null,
    error,
    isLoading: isLoading || !isLoaded,
    mutate,
  };
};
