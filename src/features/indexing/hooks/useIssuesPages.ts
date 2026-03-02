import { useMemo, useState, useCallback, useRef } from 'react';
import { http } from '@/config/axios';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { Pages, Issue } from './useIssues';

const PAGE_SIZE = 100;

export const useIssuesPages = (type: string | undefined, outputsAffectedCount?: number): Pages | null => {
    const { selectedDataProvider, isLoaded } = useDataProviderStore();
    const [isLastPageLoaded, setIsLastPageLoaded] = useState(false);
    const [totalLength, setTotalLength] = useState<number | null>(outputsAffectedCount ?? null);
    const dataRef = useRef<Issue[]>([]);
    const pageNumberRef = useRef(0);
    const totalLengthRef = useRef<number | null>(outputsAffectedCount ?? null);
    const isLastPageLoadedRef = useRef(false);

    const dataProviderId = selectedDataProvider?.id;

    const load = useCallback(
        async (signal?: AbortSignal): Promise<Issue[]> => {
            if (!dataProviderId || !type || !isLoaded) {
                return [];
            }

            const currentDataLength = dataRef.current.length;
            const from = currentDataLength >= PAGE_SIZE
                ? Math.round(currentDataLength / PAGE_SIZE)
                : currentDataLength;

            const params: Record<string, string> = {
                from: from.toString(),
                size: PAGE_SIZE.toString(),
            };

            if (type) {
                params.type = type;
            }

            try {
                const response = await http.get<Issue[]>(
                    `/internal/data-providers/${dataProviderId}/issues`,
                    {
                        params,
                        signal,
                    }
                );

                // Set totalLength from outputsAffectedCount on first page load
                if (pageNumberRef.current === 0 && outputsAffectedCount) {
                    totalLengthRef.current = outputsAffectedCount;
                    setTotalLength(outputsAffectedCount);
                }

                pageNumberRef.current += 1;
                const newData = (response.data || []).map((item) => ({
                    ...item,
                    id: `${pageNumberRef.current}-${item.id}`,
                    originalId: item.id,
                }));

                dataRef.current.push(...newData);

                isLastPageLoadedRef.current = isLastPageLoadedRef.current || newData.length === 0;
                setIsLastPageLoaded(prev => prev || newData.length === 0);

                return newData;
            } catch (error: unknown) {
                // Handle AbortError (intentional cancellation)
                if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                    throw error;
                }

                // Set isLastPageLoaded to prevent further pagination attempts
                isLastPageLoadedRef.current = true;
                setIsLastPageLoaded(true);

                // Handle 404 (end of data stream)
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { status?: number } };
                    if (axiosError.response?.status === 404) {
                        return [];
                    }
                }

                throw error;
            }
        },
        [dataProviderId, type, isLoaded, outputsAffectedCount]
    );

    const slice = useCallback(
        async (start: number, end: number): Promise<Issue[]> => {
            if (!dataProviderId || !type || !isLoaded) {
                return [];
            }

            // Load data incrementally until we have enough or reach last page
            while (dataRef.current.length < end && !isLastPageLoadedRef.current) {
                try {
                    await load();
                } catch (error: unknown) {
                    // AbortError is intentional, break the loop
                    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                        break;
                    }
                    // Re-throw other errors
                    throw error;
                }
            }

            // Return the requested slice
            return dataRef.current.slice(start, end);
        },
        [dataProviderId, type, isLoaded, load]
    );

    const request = useCallback(
        async (url: string): Promise<{ data: Issue['output'] }> => {
            const response = await http.get<Issue['output']>(url);
            return { data: response.data };
        },
        []
    );

    const reset = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_params: { type: string }) => {
            dataRef.current = [];
            pageNumberRef.current = 0;
            totalLengthRef.current = outputsAffectedCount ?? null;
            setTotalLength(outputsAffectedCount ?? null);
            isLastPageLoadedRef.current = false;
            setIsLastPageLoaded(false);
        },
        [outputsAffectedCount]
    );

    const pages: Pages | null = useMemo(() => {
        if (!dataProviderId || !type || !isLoaded) {
            return null;
        }

        return {
            slice,
            request,
            reset,
            type,
            isLastPageLoaded,
            totalLength: totalLengthRef.current ?? totalLength,
        };
    }, [dataProviderId, type, isLoaded, slice, request, reset, isLastPageLoaded, totalLength]);

    return pages;
};

