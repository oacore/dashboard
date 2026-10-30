import { useCallback, useEffect, useRef } from 'react';
import useSWR from 'swr';

import { fetcher, swrDefaultConfig } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';

import { useFreshFindsStore } from '../store/freshFindsStore';
import type { FreshFindsDepositFilter, FreshFindsWorksResponse } from '../types/data.types';

export type FreshFindsWorksQuery = {
  searchTerm?: string;
  setSpec?: string | null;
  depositFilters?: FreshFindsDepositFilter[];
  page?: number;
  pageSize?: number;
  accept?: string;
};

export const buildFreshFindsWorksUrl = (
  dataProviderId: number,
  query: FreshFindsWorksQuery = {},
): string => {
  const params = new URLSearchParams();

  (query.depositFilters ?? []).forEach((filter) => {
    params.append('depositFilter[]', filter);
  });

  const trimmedSearch = query.searchTerm?.trim() ?? '';
  if (trimmedSearch !== '') {
    params.append('search', trimmedSearch);
  }

  if (query.page != null) {
    params.set('page', String(query.page));
  }

  if (query.pageSize != null) {
    params.set('pageSize', String(query.pageSize));
  }

  if (query.setSpec) {
    params.set('set', query.setSpec);
  }

  if (query.accept) {
    params.set('accept', query.accept);
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
      ? buildFreshFindsWorksUrl(effectiveDataProviderId, {
          searchTerm,
          setSpec: selectedSetSpec,
          depositFilters: depositFilter,
          page: currentPage,
          pageSize,
        })
      : null;

  const freshlyFoundKey =
    isLoaded && effectiveDataProviderId
      ? buildFreshFindsWorksUrl(effectiveDataProviderId, {
          setSpec: selectedSetSpec,
          depositFilters: ['available'],
          page: 1,
          pageSize: 1,
        })
      : null;

  const fetchWorks = (url: string) =>
    fetcher(url).then((res) => res as FreshFindsWorksResponse);

  const { error, isLoading, mutate: mutateWorks } = useSWR<FreshFindsWorksResponse>(
    key,
    fetchWorks,
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

  const { data: freshlyFoundWorks, mutate: mutateFreshlyFoundTotal } = useSWR<FreshFindsWorksResponse>(
    freshlyFoundKey,
    fetchWorks,
    {
      ...swrDefaultConfig,
      onError: (err) => {
        captureHandledError(err, {
          tags: { feature: 'fresh-finds', action: 'fetch-freshly-found-total' },
          extra: { dataProviderId: effectiveDataProviderId },
        });
      },
    },
  );

  const mutate = useCallback(() => {
    return Promise.all([mutateWorks(), mutateFreshlyFoundTotal()]);
  }, [mutateWorks, mutateFreshlyFoundTotal]);

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
    freshlyFoundTotal: freshlyFoundWorks?.pagination?.totalItems ?? 0,
    hasMore: finalData.length < totalLength && hasMore && !error,
    isInitialLoad,
  };
};
