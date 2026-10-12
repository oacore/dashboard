import { useCallback, useEffect, useRef } from 'react';
import useSWR from 'swr';

import { fetcher, swrDefaultConfig } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';

import { useFreshFindsStore } from '../store/freshFindsStore';
import type { FreshFindsDepositFilter, FreshFindsWorksResponse } from '../types/data.types';

const buildFreshFindsWorksUrl = (
  dataProviderId: number,
  page: number,
  pageSize: number,
  searchTerm: string,
  setSpec?: string | null,
  depositFilters: FreshFindsDepositFilter[] = [],
): string => {
  const params = new URLSearchParams();

  depositFilters.forEach((filter) => {
    params.append('depositFilter[]', filter);
  });

  const trimmedSearch = searchTerm.trim();
  if (trimmedSearch !== '') {
    params.append('search', trimmedSearch);
  }

  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  if (setSpec) {
    params.set('set', setSpec);
  }

  return `/internal/data-providers/${dataProviderId}/fresh-finds/works?${params.toString()}`;
};

export const useFreshFindsData = (pageSize = 10, dataProviderId = 0) => {
  const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
  const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id || 0;

  const {
    searchTerm,
    depositFilter,
    currentPage,
    allData,
    totalLength,
    hasMore,
    lastSearchTerm,
    lastDepositFilter,
    lastDataProviderId,
    isLoadingMore,
    setCurrentPage,
    setAllData,
    appendData,
    setTotalLength,
    setHasMore,
    setIsLoadingMore,
    resetDataState,
    updateLastParams,
  } = useFreshFindsStore();

  const prevSetSpecRef = useRef(selectedSetSpec);
  useEffect(() => {
    if (prevSetSpecRef.current !== selectedSetSpec) {
      prevSetSpecRef.current = selectedSetSpec;
      resetDataState();
    }
  }, [selectedSetSpec, resetDataState]);

  if (
    searchTerm !== lastSearchTerm ||
    depositFilter.join(',') !== lastDepositFilter.join(',') ||
    effectiveDataProviderId !== lastDataProviderId
  ) {
    resetDataState();
    updateLastParams(searchTerm, effectiveDataProviderId, depositFilter);
  }

  const key =
    isLoaded && effectiveDataProviderId
      ? buildFreshFindsWorksUrl(
          effectiveDataProviderId,
          currentPage,
          pageSize,
          searchTerm,
          selectedSetSpec,
          depositFilter,
        )
      : null;

  const { error, isLoading, mutate } = useSWR<FreshFindsWorksResponse>(
    key,
    () => fetcher(key!).then((res) => res as FreshFindsWorksResponse),
    {
      ...swrDefaultConfig,
      onSuccess: (response) => {
        const items = response?.items ?? [];
        setTotalLength(response?.pagination?.totalItems ?? 0);
        setHasMore(response?.pagination?.hasNextPage ?? false);

        if (currentPage === 1) {
          setAllData(items);
        } else {
          appendData(items);
        }

        setIsLoadingMore(false);
      },
      onError: (err) => {
        setIsLoadingMore(false);
        captureHandledError(err, {
          tags: { feature: 'fresh-finds', action: 'fetch' },
          extra: {
            dataProviderId: effectiveDataProviderId,
            page: currentPage,
            pageSize,
            searchTerm,
            depositFilter,
          },
        });
      },
    },
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setCurrentPage(currentPage + 1);
  }, [
    currentPage,
    hasMore,
    isLoadingMore,
    setCurrentPage,
    setIsLoadingMore,
  ]);

  const finalData = error ? [] : allData;
  const isInitialLoad = currentPage === 1 && allData.length === 0;

  return {
    data: finalData,
    error,
    isLoading: isInitialLoad && (isLoading || !isLoaded),
    isLoadingMore: isLoadingMore && isLoading,
    mutate,
    loadMore,
    totalLength,
    hasMore: finalData.length < totalLength && hasMore && !error,
    isInitialLoad,
  };
};
