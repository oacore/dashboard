import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@/config/swr';

type OutputResult = {
    documentId: string | number;
    outputData?: unknown;
    error?: unknown;
};

export const useMultipleOutputs = (documentIds: (string | number | undefined)[]) => {
    const validIds = documentIds.filter((id): id is string | number => !!id);

    const key = validIds.length > 0
        ? `outputs:${validIds.join(',')}`
        : null;

    const { data, error, isLoading } = useSWR<OutputResult[]>(
        key,
        async () => {
            const responses = await Promise.allSettled(
                validIds.map(async (id) => {
                    const result = await fetcher(createSWRKey(`/v3/outputs/${id}`));
                    return { documentId: id, outputData: result } as OutputResult;
                }),
            );

            return responses.map((res, index) => {
                if (res.status === 'fulfilled') {
                    return res.value;
                }
                return {
                    documentId: validIds[index],
                    error: res.reason,
                } as OutputResult;
            });
        },
        swrDefaultConfig,
    );

    const outputs = data || [];
    const hasError = outputs.some((item) => !!item.error);

    return {
        outputs,
        isLoading,
        hasError,
        error,
    };
};
