import { useState, useMemo, useCallback, useEffect } from 'react';

const DEFAULT_ITEMS_PER_PAGE = 10;

// Helper function to sort data
const sortData = <T extends { [key: string]: unknown }>(
    data: T[],
    sortField: string | null,
    sortOrder: 'asc' | 'desc' | null,
    customSorters?: Record<string, (a: T, b: T) => number>
): T[] => {
    if (!sortField || !sortOrder) {
        return data;
    }

    // Check if there's a custom sorter for this field
    if (customSorters && customSorters[sortField]) {
        return [...data].sort((a, b) => {
            const result = customSorters[sortField](a, b);
            return sortOrder === 'asc' ? result : -result;
        });
    }

    return [...data].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Handle arrays (e.g., authors)
        if (Array.isArray(aValue) && Array.isArray(bValue)) {
            const aStr = aValue.join(', ').toLowerCase();
            const bStr = bValue.join(', ').toLowerCase();
            const comparison = aStr.localeCompare(bStr);
            return sortOrder === 'asc' ? comparison : -comparison;
        }

        // Handle strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
            return sortOrder === 'asc' ? comparison : -comparison;
        }

        // Handle numbers
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Fallback: convert to string and compare
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return sortOrder === 'asc' ? comparison : -comparison;
    });
};

export interface UseTablePaginationAndSortOptions<T> {
    data: T[];
    itemsPerPage?: number;
    resetOnDataChange?: boolean;
    customSorters?: Record<string, (a: T, b: T) => number>;
}

export interface UseTablePaginationAndSortReturn<T> {
    // Sorted and paginated data
    visibleData: T[];
    sortedData: T[];

    // State
    sortField: string | null;
    sortOrder: 'asc' | 'desc' | null;
    visibleItemsCount: number;

    // Computed values
    hasMore: boolean;
    totalLength: number;

    // Handlers
    handleSort: (field: string, order: 'asc' | 'desc' | null) => void;
    handleLoadMore: () => void;
    resetPagination: () => void;
}

export const useTablePaginationAndSort = <T extends { [key: string]: unknown }>({
    data,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    resetOnDataChange = true,
    customSorters,
}: UseTablePaginationAndSortOptions<T>): UseTablePaginationAndSortReturn<T> => {
    const [visibleItemsCount, setVisibleItemsCount] = useState(itemsPerPage);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Sort the full dataset first
    const sortedData = useMemo(() => {
        return sortData(data, sortField, sortOrder, customSorters);
    }, [data, sortField, sortOrder, customSorters]);

    // Slice sorted data to show only visible items
    const visibleData = useMemo(() => {
        return sortedData.slice(0, visibleItemsCount);
    }, [sortedData, visibleItemsCount]);

    // Check if there are more items to show
    const hasMore = useMemo(() => {
        return visibleItemsCount < sortedData.length;
    }, [visibleItemsCount, sortedData.length]);

    // Handle "show more" click
    const handleLoadMore = useCallback(() => {
        setVisibleItemsCount(prev => prev + itemsPerPage);
    }, [itemsPerPage]);

    // Handle sort changes
    const handleSort = useCallback((field: string, order: 'asc' | 'desc' | null) => {
        setSortField(field);
        setSortOrder(order);
        // Keep current visible count when sorting - don't reset
    }, []);

    // Reset pagination function
    const resetPagination = useCallback(() => {
        setVisibleItemsCount(itemsPerPage);
    }, [itemsPerPage]);

    // Reset visible count when data changes
    useEffect(() => {
        if (resetOnDataChange) {
            setVisibleItemsCount(itemsPerPage);
        }
    }, [data.length, itemsPerPage, resetOnDataChange]);

    return {
        visibleData,
        sortedData,
        sortField,
        sortOrder,
        visibleItemsCount,
        hasMore,
        totalLength: sortedData.length,
        handleSort,
        handleLoadMore,
        resetPagination,
    };
};
