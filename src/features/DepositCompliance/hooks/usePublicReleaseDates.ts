import useSWR from 'swr';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { fetcher, swrDefaultConfig } from '@/config/swr';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { usePublicReleaseDatesStore, type PublicReleaseDatesItem } from '../store/publicReleaseDatesStore';

const extractDatePart = (dateTimeString: string): string => {
  return dateTimeString.split(' ')[0];
};

const buildPublicReleaseDatesUrl = (
  dataProviderId: number,
  from: number,
  size: number,
  sortField: string | null,
  sortOrder: 'asc' | 'desc' | null,
  searchTerm: string,
  startDate?: string,
  endDate?: string,
  setSpec?: string | null
): string => {
  const baseUrl = `/internal/data-providers/${dataProviderId}/public-release-dates`;
  const params = new URLSearchParams({
    from: from.toString(),
    size: size.toString(),
    wait: 'true',
  });

  if (sortField && sortOrder) {
    params.append('orderBy', `${sortField}:${sortOrder}`);
  }

  if (searchTerm.trim()) {
    params.append('q', searchTerm.trim());
  }

  if (startDate && endDate) {
    params.append('fromDate', extractDatePart(startDate));
    params.append('toDate', extractDatePart(endDate));
  }

  if (setSpec) {
    params.append('set', setSpec);
  }

  return `${baseUrl}?${params.toString()}`;
};

export const usePublicReleaseDates = () => {
  const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
  const { dateRange } = useDepositDatesStore();
  const {
    searchTerm,
    sortField,
    sortOrder,
    currentPage,
    allData,
    isLoadingMore,
    setAllData,
    appendData,
    setIsLoadingMore,
    resetDataState,
  } = usePublicReleaseDatesStore();

  const effectiveDataProviderId = selectedDataProvider?.id || 0;
  const pageSize = 100;

  // Create a params key to detect when filters change
  const paramsKey = useMemo(
    () =>
      JSON.stringify({
        dataProviderId: effectiveDataProviderId,
        searchTerm,
        sortField,
        sortOrder,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        selectedSetSpec,
      }),
    [effectiveDataProviderId, searchTerm, sortField, sortOrder, dateRange.startDate, dateRange.endDate, selectedSetSpec]
  );

  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);

  // Reset data when params change
  useEffect(() => {
    if (paramsKey !== lastParamsKey) {
      resetDataState();
      setLastParamsKey(paramsKey);
    }
  }, [paramsKey, lastParamsKey, resetDataState]);

  const buildUrl = useCallback(
    (page: number) => {
      if (!effectiveDataProviderId) return null;
      return buildPublicReleaseDatesUrl(
        effectiveDataProviderId,
        page * pageSize,
        pageSize,
        sortField,
        sortOrder,
        searchTerm,
        dateRange.startDate,
        dateRange.endDate,
        selectedSetSpec
      );
    },
    [effectiveDataProviderId, sortField, sortOrder, searchTerm, dateRange.startDate, dateRange.endDate, selectedSetSpec]
  );

  const key = isLoaded && effectiveDataProviderId ? buildUrl(currentPage) : null;

  const typedFetcher = useCallback(
    async (url: string): Promise<PublicReleaseDatesItem[]> => {
      const result = await fetcher(url);
      return result as PublicReleaseDatesItem[];
    },
    []
  );

  const { error, isLoading, mutate } = useSWR<PublicReleaseDatesItem[]>(
    key,
    key ? typedFetcher : null,
    {
      ...swrDefaultConfig,
      onSuccess: (data: PublicReleaseDatesItem[]) => {
        if (!data || data.length === 0) return;

        if (currentPage === 0) {
          setAllData(data);
        } else {
          appendData(data);
        }

        setIsLoadingMore(false);
      },
      onError: () => {
        setIsLoadingMore(false);
      },
    }
  );

  const loadMore = useCallback(() => {
    if (isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    usePublicReleaseDatesStore.getState().setCurrentPage(currentPage + 1);
  }, [isLoadingMore, isLoading, currentPage, setIsLoadingMore]);

  const finalData = error ? [] : allData;
  const isInitialLoad = currentPage === 0 && allData.length === 0;

  return {
    data: finalData,
    error,
    isLoading: isInitialLoad && (isLoading || !isLoaded),
    isLoadingMore: isLoadingMore && isLoading,
    mutate,
    loadMore,
    isInitialLoad,
  };
};
