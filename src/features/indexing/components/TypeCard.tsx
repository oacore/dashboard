import { useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import { useIssues } from '../hooks/useIssues';
import { useIssuesPages, type Pages } from '../hooks/useIssuesPages';
import texts from '../texts';
import { WarningFilled, WechatFilled } from '@ant-design/icons';
import { ArticlesList } from './ArticlesList';
import '../styles.css';

interface TypeCardProps {
    type: string;
    count: number;
    title: string;
    description?: string;
    resolution?: string;
    issuesList?: {
        pages?: Pages | null;
        downloadUrl?: string;
        type?: string;
        [key: string]: unknown;
    } | null;
    hidden?: boolean;
}

export const TypeCard: React.FC<TypeCardProps> = ({
    type,
    count,
    title,
    description,
    resolution,
    issuesList,
    hidden,
}) => {
    const [visibleList, setVisibleList] = useState(false);
    const pages = useIssuesPages(issuesList?.type, count);
    const {
        loading: articlesLoading,
        onReset,
        data: articles,
        loadMore: loadMoreArticles,
        onSetActiveArticle,
        activeArticle,
        changeArticleVisibility,
    } = useIssues({ pages: pages || null });

    const handleToggleVisibleList = () => {
        const newVisibleState = !visibleList;
        setVisibleList(newVisibleState);
        if (newVisibleState && (!articles || articles.data.length === 0)) {
            onReset();
        }
    };

    const isError = type.toLowerCase() === 'error';
    const isWarning = type.toLowerCase() === 'warning';

    return (
        <div
            className={classNames('validation-list-item', {
                'type-card-hidden': hidden,
            })}
        >
            <div className="validation-card-section">
                <div className="type-card-header">
                    <WarningFilled
                        className={classNames({
                            'card-icon-warning': isWarning,
                            'card-icon-error': isError,
                        })}
                    />
                    <h3 className="type-card-title">{title}</h3>
                </div>
                {description && (
                    <p className="validation-card-text">{description}</p>
                )}
                <div>
                    <div className="type-card-header">
                        <WechatFilled className="card-icon-comment" />
                        <h3 className="type-card-title">
                            {texts.issues['recommendation-card-title']}
                        </h3>
                    </div>
                    <p className="recomendation-text">
                        {resolution || 'No recommendations yet'}
                    </p>
                </div>
                {count !== 1 && (
                    <div className="count-wrapper">
                        <div
                            className={classNames('count', {
                                'card-warning': isWarning,
                                'card-error': isError,
                            })}
                        >
                            {count.toLocaleString()}
                        </div>
                        <div
                            className={classNames('warning-description', {
                                'card-warning-background': isWarning,
                                'card-error-background': isError,
                            })}
                        >
                            {texts.issues.affected}
                        </div>
                    </div>
                )}
                {count !== 1 && (
                    <div className="type-card-actions">
                        {issuesList?.downloadUrl && (
                            <Button className="issue-button" type="primary" href={issuesList.downloadUrl}>
                                {texts.issues['download-action']}
                            </Button>
                        )}
                        <Button
                            type="default"
                            disabled={articlesLoading}
                            onClick={handleToggleVisibleList}
                            className="issue-button"
                        >
                            {visibleList
                                ? texts.issues['list-actions'].hide
                                : texts.issues['list-actions'].show}
                        </Button>
                    </div>
                )}
            </div>
            {visibleList && (
                <ArticlesList
                    fetchData={loadMoreArticles}
                    issuesList={articles}
                    loading={articlesLoading}
                    activeArticle={activeArticle}
                    onSetActiveArticle={onSetActiveArticle}
                    changeArticleVisibility={changeArticleVisibility}
                />
            )}
        </div>
    );
};
