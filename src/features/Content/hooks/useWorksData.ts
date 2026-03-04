import useSWR from 'swr';
import { swrDefaultConfig } from '@/config/swr';
import type { ContentData } from '@features/Content/types/data.types';
import { useCallback, useEffect, useRef } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useContentTableStore } from '@features/Content/store/contentStore';
import { http } from '@/config/axios';
import { useState } from 'react';

export const useWorksListData = (
    pageSize = 100,
    searchTerm = '',
    dataProviderId = 0,
    sortField: string | null = null,
    sortOrder: 'asc' | 'desc' | null = null
) => {
    const { selectedDataProvider, isLoaded, selectedSetSpec } = useDataProviderStore();
    const effectiveDataProviderId = dataProviderId || selectedDataProvider?.id || 0;

    const {
        currentPage,
        allData,
        totalLength,
        lastSearchTerm,
        lastDataProviderId,
        lastSortField,
        lastSortOrder,
        isLoadingMore,
        setCurrentPage,
        setAllData,
        appendData,
        setTotalLength,
        setIsLoadingMore,
        resetDataState,
        updateLastParams
    } = useContentTableStore();

    const prevSetSpecRef = useRef(selectedSetSpec);
    useEffect(() => {
        if (prevSetSpecRef.current !== selectedSetSpec) {
            prevSetSpecRef.current = selectedSetSpec;
            resetDataState();
        }
    }, [selectedSetSpec, resetDataState]);

    if (
        searchTerm !== lastSearchTerm ||
        effectiveDataProviderId !== lastDataProviderId ||
        sortField !== lastSortField ||
        sortOrder !== lastSortOrder
    ) {
        resetDataState();
        updateLastParams(searchTerm, effectiveDataProviderId, sortField, sortOrder);
    }

    const buildUrl = (page: number) => {
        const baseUrl = `/internal/data-providers/${effectiveDataProviderId}/works`;
        const params = new URLSearchParams({
            from: (page * pageSize).toString(),
            size: pageSize.toString(),
        });

        if (searchTerm.trim()) {
            params.append('q', searchTerm.trim());
        }

        if (sortField && sortOrder) {
            params.append('orderBy', `${sortField}:${sortOrder}`);
        }

        if (selectedSetSpec) {
            params.append('set', selectedSetSpec);
        }

        return `${baseUrl}?${params.toString()}`;
    };

    // Custom fetcher that captures headers
    const fetchWithHeaders = async (url: string) => {
        const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}${url}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Extract collection-length from headers
        const collectionLength = response.headers.get('collection-length');
        if (collectionLength) {
            setTotalLength(parseInt(collectionLength, 10));
        }

        const data = await response.json();

        // Ensure each item has a disabled property (default to false if not provided by API)
        return data.map((item: Partial<ContentData>) => ({
            ...item,
            disabled: item.disabled ?? false
        }));
    };

    const key = (isLoaded && effectiveDataProviderId) ? buildUrl(currentPage) : null;

    const { error, isLoading, mutate } = useSWR<ContentData[]>(
        key,
        fetchWithHeaders,
        {
            ...swrDefaultConfig,
            onSuccess: (data) => {
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
            }
        },
    );

    const loadMore = useCallback(() => {
        if (allData.length >= totalLength || isLoadingMore) return;
        setIsLoadingMore(true);
        setCurrentPage(currentPage + 1);
    }, [allData.length, totalLength, isLoadingMore, currentPage, setIsLoadingMore, setCurrentPage]);

    const finalData = error ? [] : allData;

    // Determine if this is initial load (no data yet and loading)
    const isInitialLoad = currentPage === 0 && allData.length === 0;

    return {
        data: finalData,
        error,
        isLoading: isInitialLoad && (isLoading || !isLoaded), // Only show table loading for initial load
        isLoadingMore: isLoadingMore && isLoading, // Show button loading for load more
        mutate,
        loadMore,
        totalLength,
        hasMore: finalData.length < totalLength && !error,
        isInitialLoad,
    };
};

// Add new hook for visibility management
export const useWorkVisibility = () => {
    const [loading, setLoading] = useState(false);
    const { updateWorkVisibility } = useContentTableStore();

    const changeVisibility = async (rowId: string) => {

        const { allData } = useContentTableStore.getState();
        const row = allData.find((r) => {
            return r.id === Number(rowId);
        });

        if (!row) {
            throw new Error(`Work with ID ${rowId} not found`);
        }

        const { disabled } = row;
        const newDisabledState = !disabled;

        updateWorkVisibility(row.id.toString(), newDisabledState);

        setLoading(true);

        try {
            await http.patch(`/internal/works/${rowId}`, {
                disabled: newDisabledState,
            });
        } catch (error) {
            updateWorkVisibility(row.id.toString(), disabled);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        changeVisibility,
        loading,
    };
};
