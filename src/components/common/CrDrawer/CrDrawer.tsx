import React, { useState } from 'react';
import type { ArticleAdditionalData } from '@hooks/useArticleData.ts';
import { Spin, Button, Tooltip, Dropdown } from 'antd';
import BurgerMenu from '@/assets/icons/burgerMenu.svg';
import idIcon from '@/assets/icons/id.svg';
import { LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { TextData } from '@features/Orcid/texts';
import "./styles.css"
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import classNames from 'classnames';
import { getSdgIcon } from '@components/common/CrSdgRendered/use-sdg-icon-renderer.tsx';

interface Author {
    name: string;
    [key: string]: unknown;
}

interface Orcid {
    orcidId: string;
    [key: string]: unknown;
}

interface SdgItem {
    type: string;
    score: number;
}

interface Repository {
    id: string;
    name: string;
    urlHomepage?: string;
    uriJournals?: string;
    physicalName: string;
    roarId: number;
    baseId: number;
    pdfStatus?: string;
    nrUpdates: number;
    lastUpdateTime?: string;
}

interface ArticleField {
    name: string;
    key: string;
    findBy?: string;
}

interface OrcidDrawerContentProps {
    article?: ArticleAdditionalData | null;
    error?: Error | null;
    isLoading?: boolean;
    removeLiveActions?: boolean;
    onVisibilityChange?: (article: ArticleAdditionalData) => Promise<void>;
    outputsUrl?: string;
    isChangingVisibility?: boolean;
}

// Helper function for safe property access
const getPropertyValue = <T extends Record<string, unknown>>(
    obj: T,
    key: string
): string | undefined => {
    return key in obj ? String(obj[key]) : undefined;
};

export const CrDrawer: React.FC<OrcidDrawerContentProps> = ({
    article,
    error,
    removeLiveActions,
    isLoading,
    onVisibilityChange,
    outputsUrl,
    isChangingVisibility,
}) => {
    const [visibleMenu, setVisibleMenu] = useState(false)

    const { article: text } = TextData

    const fields = (text?.fields || []).map((item: ArticleField) => {
        if (!article) return null;

        let value: unknown = article[item.key];

        if (Array.isArray(value)) {
            if (item.key === 'authors' && item.findBy) {
                value = value.map((author: Author) => {
                    const authorValue = getPropertyValue(author, item.findBy!);
                    return authorValue || '';
                }).join(' ');
            } else if (item.key === 'orcids' && item.findBy) {
                value = value.map((orcid: Orcid) => {
                    const orcidValue = getPropertyValue(orcid, item.findBy!);
                    return (
                        <div className="orcide-wrapper" key={orcidValue}>
                            <img src={idIcon} alt="idIcon" />
                            {orcidValue}
                        </div>
                    );
                }).filter(Boolean) as React.ReactNode[];
            } else if (item.key === 'sdg') {
                value = value.map((sdgItem: SdgItem) => (
                    <div className="sdg-score-wrapper" key={sdgItem.score}>
                        <div className="sdg-indicator">{getSdgIcon(sdgItem.type, sdgItem.score)}</div>
                        <span className="sdg-score">{sdgItem.score}</span>
                    </div>
                )) as React.ReactNode[];
            }
        } else if (item.key === 'repositories' && value && typeof value === 'object') {
            value = (value as Repository).name;
        }

        return {
            ...item,
            value,
        };
    }).filter((field): field is NonNullable<typeof field> => field !== null);

    const actions = (text?.actions || []).map((item) => ({
        ...item,
        value: article?.[item.key],
    }))

    const toggleVisibleMenu = () => {
        setVisibleMenu(!visibleMenu)
    }

    const visibility = (text?.visibility || []).find(
        (item) => item.disabled === article?.disabled
    ) || text?.visibility?.[0]

    const handleVisibilityChange = async () => {
        if (article && onVisibilityChange) {
            try {
                await onVisibilityChange(article);
            } catch (error) {
                console.error('Failed to change visibility:', error);
            }
        }
    };

    // Helper function to get the appropriate icon based on visibility state
    const getVisibilityIcon = () => {
        if (visibility?.icon === 'eye') {
            return <EyeOutlined className="action-button-icon" />;
        } else if (visibility?.icon === 'eye-off') {
            return <EyeInvisibleOutlined className="action-button-icon" />;
        }
        return null;
    };

    if (error) {
        return (
            <div style={{ padding: '20px', color: '#ff4d4f' }}>
                Error loading article data: {error.message}
            </div>
        );
    }

    return (
        <div className="article">
            {isLoading ? (
                <div className="spinner-wrapper">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
            ) : (
                <>
                    <div className="article-header">
                        <h2>{article?.title || 'No title available'}</h2>
                        {removeLiveActions ? (
                            <div
                                className={`actions ${removeLiveActions ? 'gap' : ''}`}
                            >
                                <Button
                                    type="default"
                                    target="_blank"
                                    href={outputsUrl}
                                >
                                    Open in CORE
                                </Button>
                                <Button
                                    type="default"
                                    target="_blank"
                                    href={`https://api.core.ac.uk/oai/${article?.oai}`}
                                >
                                    Open in the Repository
                                </Button>
                            </div>
                        ) : (
                            <div className="actions">
                                <Tooltip placement="top" title={visibility?.extraText}>
                                    <Button
                                        disabled={isChangingVisibility}
                                        className={classNames('drawer-action-button', {
                                            'action-button-disabled': visibility?.disabled,
                                        })}
                                        onClick={handleVisibilityChange}
                                    >
                                        {getVisibilityIcon()}
                                        {visibility?.title}
                                    </Button>
                                </Tooltip>
                                <Dropdown
                                    trigger={['click']}
                                    placement="bottomRight"
                                    className="menu"
                                    menu={{
                                        items: actions.map(({ title, key, generatedUrl }) => ({
                                            key,
                                            label: (
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={
                                                        generatedUrl
                                                            ? outputsUrl
                                                            : `https://api.core.ac.uk/oai/${article?.oai}`
                                                    }
                                                >
                                                    {title}
                                                </a>
                                            ),
                                        }))
                                    }}
                                >
                                    <Button
                                        className="action-button-pure"
                                        onClick={toggleVisibleMenu}
                                    >
                                        <img src={BurgerMenu} alt="" />
                                    </Button>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                    <div className="drawer-inner-wrapper">
                        {fields.map(
                            ({ name, value, key }: { name: string; value: unknown; key: string }) =>
                                value && (
                                    <div className="drawer-inner-box" key={key}>
                                        <p className="box-prop">{name}</p>
                                        <div className="box-caption">
                                            <div className={`box-caption-text ${[`box-caption-${key.toLowerCase()}`]} ${name === 'SDG' ? 'sdg-wrapper' : ''}`}>
                                                {Array.isArray(value) ? (
                                                    value
                                                ) : (
                                                    <CrShowMore
                                                        text={name.includes('Date') && typeof value === 'string'
                                                            ? value.split('T')[0]
                                                            : String(value)}
                                                        maxLetters={200}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                        ) as React.ReactNode}
                    </div>
                </>
            )}
        </div>
    );
};
