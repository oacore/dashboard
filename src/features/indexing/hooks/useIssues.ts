import { useState, useCallback, useEffect, useMemo } from 'react';
import { http } from '@/config/axios';
import { captureHandledError } from '@/utils/captureHandledError';
import { useArticlesData } from '@/hooks/useArticlesData';

export interface Issue {
    id: string;
    originalId?: string;
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

const getIssueArticleId = (issue: Issue): string | null => {
    if (issue.output?.id) return issue.output.id;
    if (issue.originalId) return issue.originalId;
    if (issue.outputUrl) {
        const [, id] = issue.outputUrl.match(/\/([^/?#]+)(?:[?#].*)?$/) ?? [];
        if (id) return id;
    }

    const [, idWithoutPagePrefix] = issue.id.match(/^\d+-(.+)$/) ?? [];
    return idWithoutPagePrefix || issue.id || null;
};

export const useIssues = ({ pages }: UseIssuesParams) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [issueWithArticles, setIssueWithArticles] = useState<IssueWithArticles | null>(null);
    const [activeArticle, setActiveArticle] = useState<Issue['output'] | null>(null);
    const [loading, setLoading] = useState(false);
    const articleIds = useMemo(
        () => issues
            .filter(({ output }) => output == null)
            .map(getIssueArticleId)
            .filter((id): id is string => Boolean(id)),
        [issues]
    );
    const {
        data: articlesData,
        isLoading: articlesLoading,
    } = useArticlesData(articleIds.length > 0 ? articleIds : null);

    useEffect(() => {
        if (articlesData.length === 0) return;

        setIssueWithArticles((prev) => {
            if (!prev) return prev;

            const articlesById = new Map(
                articlesData.map((article) => [String(article.id), article])
            );
            const updatedData = prev.data.map((issue) => {
                if (issue.output) return issue;

                const articleId = getIssueArticleId(issue);
                const article = articleId ? articlesById.get(articleId) : null;

                return article ? {...issue, output: article} : issue;
            });

            return {...prev, data: updatedData};
        });

        setIssues((prev) => {
            const articlesById = new Map(
                articlesData.map((article) => [String(article.id), article])
            );

            return prev.map((issue) => {
                if (issue.output) return issue;

                const articleId = getIssueArticleId(issue);
                const article = articleId ? articlesById.get(articleId) : null;

                return article ? {...issue, output: article} : issue;
            });
        });
    }, [articlesData]);

    const loadMore = useCallback(
        async ({ initial = false }: { initial?: boolean } = {}) => {
            if (!pages) return;
            setLoading(true);

            const data = initial
                ? await pages.slice(0, 10)
                : await pages.slice(0, issues.length + 10);

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

            const updatedArticle = { ...article, disabled: !article?.disabled };
            setActiveArticle(updatedArticle);

            setIssueWithArticles((prev) => {
                if (!prev) return prev;
                const updatedData = prev.data.map((issue) =>
                    issue.output?.id === article.id
                        ? { ...issue, output: { ...issue.output, disabled: !article?.disabled } }
                        : issue
                );
                return { ...prev, data: updatedData };
            });
        } catch (error) {
            captureHandledError(error, {
                tags: { feature: 'indexing', action: 'change_article_visibility' },
                extra: { articleId: article.id },
            });
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
        loading: loading || articlesLoading,
        data: issueWithArticles,
        done: !pages ? true : pages.isLastPageLoaded ?? true,
        onSetActiveArticle,
        changeArticleVisibility,
        setIssues,
        activeArticle,
        onReset,
    };
};

