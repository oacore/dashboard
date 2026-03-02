import React, { useMemo } from 'react';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import { CrDrawer } from '@/components/common/CrDrawer/CrDrawer.tsx';
import type { ReusableTableColumn } from '@/components/common/CrTable/types.ts';
import type { DrawerConfig } from '@/components/common/CrTable/types.ts';
import type { ArticleAdditionalData } from '@/hooks/useArticleData.ts';
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import { formatDate } from '@/utils/helpers.ts';
import classNames from 'classnames';
import '../styles.css';
import {getScrollConfig} from '@hooks/useScrollView.ts';

interface Issue {
    id: string;
    output?: {
        id: string;
        oai?: string;
        title?: string;
        authors?: Array<{ name: string }>;
        publishedDate?: string;
        udpatedDate?: string;
        disabled?: boolean;
        [key: string]: unknown;
    } | null;
    outputUrl?: string;
    [key: string]: unknown;
}

interface IssueWithArticles {
    data: Issue[];
    size: number;
    isLastPageLoaded?: boolean;
    [key: string]: unknown;
}

interface ArticlesListProps {
    issuesList: IssueWithArticles | null;
    fetchData: () => void;
    onSetActiveArticle: (id: string) => void;
    activeArticle: Issue['output'] | null;
    changeArticleVisibility: (article: Issue['output']) => Promise<void>;
    loading: boolean;
}

const createColumns = (): ReusableTableColumn<Issue>[] => [
    {
        key: 'oai',
        title: 'OAI',
        dataIndex: 'oai',
        sortable: false,
        align: 'center',
        className: 'oai-column',
        render: (_value: unknown, record: Issue) => {
            const oai = record?.output?.oai;
            if (oai) {
                return (
                    <div className="oai-cell">
                        {String(oai).split(':').pop()}
                    </div>
                );
            }
            return '-';
        },
    },
    {
        key: 'title',
        title: 'Title',
        dataIndex: 'title',
        sortable: false,
        align: 'left',
        render: (_value: unknown, record: Issue) => {
            const title = record?.output?.title;
            return (
                <div className="overflow-text">
                    {title || '-'}
                </div>
            );
        },
    },
    {
        key: 'authors',
        title: 'Authors',
        dataIndex: 'authors',
        sortable: false,
        align: 'left',
        render: (_value: unknown, record: Issue) => {
            const authors = record?.output?.authors;
            if (Array.isArray(authors) && authors.length > 0) {
                const authorNames = authors
                    .map((author) => author?.name)
                    .filter(Boolean)
                    .join(' ');
                return (
                    <div className="overflow-text">
                        {authorNames}
                    </div>
                );
            }
            return '-';
        },
    },
    {
        key: 'publicationDate',
        title: 'Publication date',
        dataIndex: 'publicationDate',
        sortable: false,
        align: 'center',
        render: (_value: unknown, record: Issue) => {
            const publishedDate = record?.output?.publishedDate;
            return publishedDate ? formatDate(publishedDate) : '-';
        },
    },
    {
        key: 'updateDate',
        title: 'Update date',
        dataIndex: 'updateDate',
        sortable: false,
        align: 'center',
        className: 'date-cell',
        render: (_value: unknown, record: Issue) => {
            const updatedDate = record?.output?.udpatedDate;
            return updatedDate ? formatDate(updatedDate) : '-';
        },
    },
    {
        key: 'visibility',
        title: '',
        dataIndex: 'visibility',
        sortable: false,
        align: 'center',
        className: 'visibility-status-column',
        render: (_value: unknown, record: Issue) => {
            const disabled = record?.output?.disabled;
            return (
                <div
                    className={classNames('visibility-icon', {
                        'visibility-icon-dark': disabled,
                    })}
                >
                    {disabled ? (
                        <EyeInvisibleFilled />
                    ) : (
                        <EyeFilled />
                    )}
                </div>
            );
        },
    },
];

export const ArticlesList: React.FC<ArticlesListProps> = ({
    issuesList,
    fetchData,
    onSetActiveArticle,
    activeArticle,
    changeArticleVisibility,
    loading,
}) => {
    const columns = useMemo(() => createColumns(), []);

    const data = issuesList?.data || [];
    const hasMore = issuesList ? !issuesList.isLastPageLoaded : false;

    // Only show table loading on initial load (when data is empty)
    const isInitialLoading = loading && data.length === 0;
    // Show button loading when loading more (when data already exists)
    const isLoadingMore = loading && data.length > 0;

    const drawerConfig: DrawerConfig<Issue> = {
        enabled: true,
        content: () => (
            <div className="drawer-wrapper">
                <CrDrawer
                    article={activeArticle as ArticleAdditionalData | null}
                    error={null}
                    isLoading={loading}
                    onVisibilityChange={async (article) => {
                        await changeArticleVisibility(article as Issue['output']);
                    }}
                    outputsUrl={activeArticle?.id ? `https://core.ac.uk/outputs/${activeArticle.id}` : undefined}
                />
            </div>
        ),
        onRowClick: (record: Issue) => {
            if (record?.id) {
                onSetActiveArticle(record.id);
            }
        },
    };


    return (
        <div className="issue-table">
            <CrTable<Issue>
                data={data}
                columns={columns}
                loading={isInitialLoading}
                drawer={drawerConfig}
                showLoadMore={hasMore}
                onLoadMore={fetchData}
                loadMoreText="Load more"
                loadMoreLoading={isLoadingMore}
                size="middle"
                bordered={false}
                rowKey={(record) => record.id || String(Math.random())}
                totalLength={issuesList?.size || 0}
                scroll={getScrollConfig()}
            />
        </div>
    );
};


