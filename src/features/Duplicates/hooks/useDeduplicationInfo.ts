import { useCallback } from 'react';
import useSWR from 'swr';
import { fetcher, patchRequest, swrDefaultConfig } from '@/config/swr';
import type { DeduplicationDetailsItem } from '@features/Duplicates/types/data.types';
import { captureHandledError } from '@/utils/captureHandledError';

const getDeduplicationInfoKey = (workId: string | number | undefined) =>
    workId ? `/internal/versions/${workId}` : null;

export const useDeduplicationInfo = (workId: string | number | undefined) => {
    const key = getDeduplicationInfoKey(workId);

    const { data, error, isLoading, mutate } = useSWR<DeduplicationDetailsItem[] | null>(
        key,
        key ? () => fetcher(key).then((res) => res as DeduplicationDetailsItem[]) : null,
        swrDefaultConfig,
    );

    const updateWork = useCallback(
        async (
            workIdParam: string | number,
            outputId: string | number,
            type: string
        ): Promise<void> => {
            try {
                await patchRequest(`/internal/versions/${workIdParam}`, {
                    workId: workIdParam,
                    outputId,
                    type,
                });
                await mutate();
            } catch (err) {
                console.error('Error updating work:', err);
                captureHandledError(err, {
                    tags: { feature: 'duplicates', action: 'update_work' },
                    extra: { workIdParam, outputId, type },
                });
                throw err;
            }
        },
        [mutate]
    );

    const refreshDeduplicationInfo = useCallback(() => mutate(), [mutate]);

    return {
        duplicateListDetails: data ?? null,
        isLoading,
        error,
        mutate: refreshDeduplicationInfo,
        updateWork,
    };
};
