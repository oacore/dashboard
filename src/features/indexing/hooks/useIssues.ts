import { useState, useCallback } from 'react';
import { http } from '@/config/axios';

export interface Issue {
    id: string;
    output?: {
        id: string;
        [key: string]: unknown;
    } | null;
    outputUrl?: string;
    [key: string]: unknown;
}

export interface Pages {
    slice: (start: number, end: number) => Promise<Issue[]>;
    request: (url: string) => Promise<{ data: Issue['output'] }>;
    reset: (params: { type: string }) => void;
    isLastPageLoaded?: boolean;
    type?: string;
    totalLength?: number | null;
}

interface UseIssuesParams {
    pages?: Pages | null;
}

interface IssueWithArticles {
    data: Issue[];
    size: number;
    isLastPageLoaded?: boolean;
    totalLength?: number | null;
    [key: string]: unknown;
}

export const useIssues = ({ pages }: UseIssuesParams) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [issueWithArticles, setIssueWithArticles] = useState<IssueWithArticles | null>(null);
    const [activeArticle, setActiveArticle] = useState<Issue['output'] | null>(null);
    const [loading, setLoading] = useState(false);

    const loadMore = useCallback(
        async ({ initial = false }: { initial?: boolean } = {}) => {
            if (!pages) return;
            setLoading(true);

            const data = initial
                ? await pages.slice(0, 10)
                : await pages.slice(0, issues.length + 10);

            await Promise.allSettled(
                data
                    .filter(({ output }) => output == null)
                    .map((issue) =>
                        issue.outputUrl
                            ? pages.request(issue.outputUrl).then((response) => {
                                issue.output = response.data;
                            })
                            : Promise.resolve()
                    )
            );

            setLoading(false);
            setIssueWithArticles({
                ...pages,
                data,
                size: pages.totalLength ?? data.length,
                isLastPageLoaded: pages.isLastPageLoaded,
                totalLength: pages.totalLength,
            } as IssueWithArticles);
            setIssues(data);
        },
        [issues, pages]
    );

    const onSetActiveArticle = useCallback(
        (id: string) => {
            const output = issueWithArticles?.data.find(
                (issue) => issue.id === id
            )?.output;

            if (output && output.id) {
                const outputWithUrl = {
                    ...output,
                    outputUrl: `https://core.ac.uk/outputs/${output.id}`,
                };
                setActiveArticle(outputWithUrl);
            }
        },
        [issueWithArticles]
    );

    const changeArticleVisibility = async (article: Issue['output']) => {
        if (!article || !article.id) return;

        setLoading(true);
        try {
            await http.patch(`/internal/articles/${article.id}`, {
                disabled: !article?.disabled,
            });

            setActiveArticle(
                Object.assign(article, {
                    disabled: !article?.disabled,
                })
            );
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to change visibility');
        } finally {
            setLoading(false);
        }
    };

    const onReset = useCallback(() => {
        setIssues([]);
        if (pages) {
            pages.reset({ type: pages.type || '' });
        }
        loadMore({ initial: true });
    }, [loadMore, pages]);

    return {
        loadMore,
        loading,
        data: issueWithArticles,
        done: !pages ? true : pages.isLastPageLoaded ?? true,
        onSetActiveArticle,
        changeArticleVisibility,
        setIssues,
        activeArticle,
        onReset,
    };
};
