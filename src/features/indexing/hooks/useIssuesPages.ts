import { useCallback, useMemo, useRef, useState } from 'react';
import { http } from '@/config/axios';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { Issue } from '../types';

export interface Pages {
    slice: (start: number, end: number) => Promise<Issue[]>;
    request: (url: string) => Promise<{ data: Issue['output'] }>;
    reset: (params: { type: string }) => void;
    isLastPageLoaded?: boolean;
    type?: string;
    totalLength?: number | null;
}

const PAGE_SIZE = 100;

export const useIssuesPages = (
    type: string | undefined,
    outputsAffectedCount?: number
): Pages | null => {
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
            if (!dataProviderId || !type || !isLoaded) return [];

            const currentDataLength = dataRef.current.length;
            const from =
                currentDataLength >= PAGE_SIZE
                    ? Math.round(currentDataLength / PAGE_SIZE)
                    : currentDataLength;

            try {
                const response = await http.get<Issue[]>(
                    `/internal/data-providers/${dataProviderId}/issues`,
                    { params: { from, size: PAGE_SIZE, type }, signal }
                );
                const newData = response.data ?? [];

                if (pageNumberRef.current === 0 && outputsAffectedCount) {
                    totalLengthRef.current = outputsAffectedCount;
                    setTotalLength(outputsAffectedCount);
                }

                pageNumberRef.current += 1;
                const mappedData = newData.map((item) => ({
                    ...item,
                    id: `${pageNumberRef.current}-${item.id}`,
                    originalId: item.id,
                }));

                dataRef.current.push(...mappedData);
                const reachedEnd = newData.length === 0;
                isLastPageLoadedRef.current = isLastPageLoadedRef.current || reachedEnd;
                setIsLastPageLoaded((prev) => prev || reachedEnd);

                return mappedData;
            } catch (error: unknown) {
                const isAbort = error && typeof error === 'object' && 'name' in error && (error as Error).name === 'AbortError';
                if (isAbort) throw error;

                isLastPageLoadedRef.current = true;
                setIsLastPageLoaded(true);

                const axiosError = error as { response?: { status?: number } } | undefined;
                if (axiosError?.response?.status === 404) return [];

                throw error;
            }
        },
        [dataProviderId, type, isLoaded, outputsAffectedCount]
    );

    const slice = useCallback(
        async (start: number, end: number): Promise<Issue[]> => {
            if (!dataProviderId || !type || !isLoaded) return [];

            while (dataRef.current.length < end && !isLastPageLoadedRef.current) {
                try {
                    await load();
                } catch (error: unknown) {
                    const isAbort = error && typeof error === 'object' && 'name' in error && (error as Error).name === 'AbortError';
                    if (isAbort) break;
                    throw error;
                }
            }

            return dataRef.current.slice(start, end);
        },
        [dataProviderId, type, isLoaded, load]
    );

    const request = useCallback(async (url: string): Promise<{ data: Issue['output'] }> => {
        const response = await http.get<Issue['output']>(url);
        return { data: response.data };
    }, []);

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

    return useMemo(() => {
        if (!dataProviderId || !type || !isLoaded) return null;

        return {
            slice,
            request,
            reset,
            type,
            isLastPageLoaded,
            totalLength: totalLengthRef.current ?? totalLength,
        };
    }, [dataProviderId, type, isLoaded, slice, request, reset, isLastPageLoaded, totalLength]);
};
