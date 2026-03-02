import useSWR from 'swr';
import { fetcher } from '@/config/swr';
import { useState, useCallback, useEffect } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useSdgTableStore } from '../store/sdgStore';
import type { SdgTableDataItem } from '@features/Sdg/types/sdg.types';
import { buildDateRangeQuery } from '../utils/queryUtils';

export interface SdgTableDataParams {
    dataProviderId?: number | null;
    from?: number;
    size?: number;
    searchTerm?: string;
    visibleColumns?: string[];
}

const useSdgTableData = ({
    dataProviderId,
    from = 0,
    size = 50,
    searchTerm = '',
    visibleColumns = [],
}: SdgTableDataParams) => {
    const { selectedDataProvider, isLoaded } = useDataProviderStore();
    const { dateRange } = useSdgTableStore();
    const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id || null;

    const [currentFrom, setCurrentFrom] = useState(from);
    const [allData, setAllData] = useState<SdgTableDataItem[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [lastParams, setLastParams] = useState<string>('');

    // Build query string
    const buildQuery = useCallback(() => {
        let query = '';

        if (searchTerm) {
            query += encodeURIComponent(searchTerm);
        }

        const dateQuery = buildDateRangeQuery(dateRange.startDate, dateRange.endDate);
        if (dateQuery) {
            if (query) query += ' AND ';
            query += dateQuery;
        }

        const filteredColumns = visibleColumns.filter((col) => col !== 'all');
        if (filteredColumns.length > 0) {
            if (query) query += ' AND ';
            const sdgQuery = filteredColumns
                .map((col) => `sdgs:${col}`)
                .join(' OR ');
            query += `(${sdgQuery})`;
        }

        return query;
    }, [searchTerm, dateRange.startDate, dateRange.endDate, visibleColumns]);

    // Build URL
    const buildUrl = useCallback((fromValue: number) => {
        if (!effectiveDataProviderId) return null;

        const baseUrl = `/internal/data-providers/${effectiveDataProviderId}/sdg`;
        const params = new URLSearchParams({
            from: fromValue.toString(),
            size: size.toString(),
        });

        const query = buildQuery();
        if (query) {
            params.append('q', query);
        }

        return `${baseUrl}?${params.toString()}`;
    }, [effectiveDataProviderId, size, buildQuery]);

    // Create a unique key based on all params (except from) to detect when to reset
    const paramsKey = JSON.stringify({
        dataProviderId: effectiveDataProviderId,
        size,
        searchTerm,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        visibleColumns: visibleColumns.sort(),
    });

    // Reset data when params change (except from)
    useEffect(() => {
        if (paramsKey !== lastParams) {
            setCurrentFrom(0);
            setAllData([]);
            setLastParams(paramsKey);
            setIsLoadingMore(false);
        }
    }, [paramsKey, lastParams]);

    const key = (isLoaded && effectiveDataProviderId) ? buildUrl(currentFrom) : null;

    const { data, error, isLoading, mutate } = useSWR<SdgTableDataItem[]>(
        key,
        () => fetcher(key!).then(res => res as SdgTableDataItem[]),
        {
            revalidateOnFocus: false,
            dedupingInterval: 0,
            onSuccess: (responseData) => {
                if (!responseData || responseData.length === 0) return;

                setAllData(prev => {
                    if (currentFrom === 0) return responseData;
                    return [...prev, ...responseData];
                });

                setIsLoadingMore(false);
            },
            onError: () => {
                setIsLoadingMore(false);
            }
        },
    );

    // Load more function
    const loadMore = useCallback(() => {
        if (isLoadingMore || isLoading) return;
        setIsLoadingMore(true);
        setCurrentFrom(allData.length);
    }, [allData.length, isLoadingMore, isLoading]);

    const finalData = error ? [] : allData;
    const isInitialLoad = currentFrom === 0 && allData.length === 0;

    return {
        data: finalData,
        error,
        isLoading: isInitialLoad && (isLoading || !isLoaded),
        isLoadingMore: isLoadingMore && isLoading,
        mutate,
        loadMore,
        hasMore: !error && data && data.length === size,
        isInitialLoad,
    };
};

export default useSdgTableData;
