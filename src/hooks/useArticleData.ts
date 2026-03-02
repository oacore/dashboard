import useSWR from 'swr';
import { createSWRKey, fetcher } from '@config/swr.ts';
import { http } from '@config/axios.ts';
import { useState } from 'react';

export interface ArticleAdditionalData {
    id: string;
    disabled?: boolean;
    title?: string;
    abstract?: string;
    doi?: string;
    yearPublished?: number;
    publishedDate?: string;
    acceptedDate?: string;
    createdDate?: string;
    depositedDate?: string;
    updatedDate?: string;
    lastUpdate?: string;
    language?: {
        code: string;
        name: string;
    };
    authors?: Array<{
        name: string;
    }>;
    contributors?: Array<unknown>;
    documentType?: string[];
    subjects?: string[];
    tags?: string[];
    dataProvider?: {
        id: number;
        name: string;
        url: string;
        logo: string;
    };
    identifiers?: {
        doi?: string;
        oai?: string;
    };
    downloadUrl?: string;
    sourceFulltextUrls?: string[];
    urls?: string[];
    links?: Array<{
        type: string;
        url: string;
    }>;
    fulltextStatus?: string;
    deleted?: string;
    publisher?: unknown;
    journals?: unknown;
    repositories?: {
        id: string;
        openDoarId: number;
        name: string;
        urlHomepage?: string;
        uriJournals?: string;
        physicalName: string;
        roarId: number;
        baseId: number;
        pdfStatus?: string;
        nrUpdates: number;
        lastUpdateTime?: string;
    };
    repositoryDocument?: {
        id: number;
        depositedDate: string;
        publishedDate: string;
        updatedDate: string;
        acceptedDate: string;
        createdDate: string;
    };
    orcids?: Array<{
        orcidId: string;
    }>;
    sdg?: Array<{
        type: string;
        score: string;
    }>;
    oai?: string;
    license?: string;
    setSpecs?: string[];
    versions?: unknown[];
    references?: unknown[];

    [key: string]: unknown;
}

export const useArticleData = (id: string | null) => {
    const [loading, setLoading] = useState(false);

    const key = id ? createSWRKey(`https://api.core.ac.uk/internal/articles/${id}`) : null;

    const { data, error, isLoading, mutate } = useSWR<ArticleAdditionalData>(
        key,
        key ? () => fetcher(key).then(res => res as ArticleAdditionalData) : null,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute cache
            shouldRetryOnError: false,
            errorRetryCount: 0,
        },
    );

    const changeArticleVisibility = async (article: ArticleAdditionalData) => {
        setLoading(true);
        try {
            await http.patch(`/internal/articles/${article.id}`, {
                disabled: !article?.disabled,
            });

            // Update the local data optimistically
            if (data) {
                await mutate({
                    ...data,
                    disabled: !data.disabled,
                }, false);
            }
        } catch (error) {
            console.error('Error changing article visibility:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to change visibility');
        } finally {
            setLoading(false);
        }
    };

    return {
        data: data || null,
        error,
        isLoading,
        mutate,
        changeArticleVisibility,
        loading: loading || isLoading,
        isError: !!error,
        isEmpty: !isLoading && !error && !data,
    };
};
