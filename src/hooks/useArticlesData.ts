import useSWR from 'swr';
import { postRequestFetcher, swrDefaultConfig } from '@config/swr.ts';
import type { ArticleAdditionalData } from '@hooks/useArticleData.ts';

const ARTICLES_LIST_ENDPOINT = '/internal/articles/list';

export const useArticlesData = (articleIds: string[] | null) => {
    const key = articleIds && articleIds.length > 0
        ? [ARTICLES_LIST_ENDPOINT, articleIds]
        : null;

    const { data, error, isLoading, mutate } = useSWR<ArticleAdditionalData[]>(
        key,
        key
            ? () => postRequestFetcher(ARTICLES_LIST_ENDPOINT, articleIds).then(res => res as ArticleAdditionalData[])
            : null,
        swrDefaultConfig,
    );

    return {
        data: data || [],
        error,
        isLoading,
        mutate,
        loading: isLoading,
        isError: !!error,
        isEmpty: !isLoading && !error && (!data || data.length === 0),
    };
};
