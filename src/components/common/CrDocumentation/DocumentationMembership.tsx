import React from 'react';
import { Typography, Tag } from 'antd';
import { ArrowUpOutlined, PlayCircleOutlined, VideoCameraFilled } from '@ant-design/icons';
import classNames from 'classnames';
import { Markdown } from '@core/core-ui';
import redirectLinkIcon from '@/assets/icons/redirectLink.svg';
import './styles.css';

const { Title } = Typography;

// Types
export interface Tutorial {
    src: string;
    title?: string;
    text: string;
    img?: string;
}

export interface DocumentationImage {
    file: string;
    source?: string;
}

export interface RedirectLink {
    link: string;
    text: string;
    image?: string;
}

export interface MembershipTypes {
    [key: string]: 'Yes' | 'No';
}

export interface DocumentationItem {
    id: string;
    title: string;
    descriptionAbout: string;
    membershipTypes?: MembershipTypes;
    'membership-types'?: MembershipTypes; // Support kebab-case from content
    tutorial?: Tutorial;
    redirect?: RedirectLink;
    images?: DocumentationImage[];
    subTitle?: string;
    subDescription?: string;
    border?: boolean;
    divider?: boolean;
}

export interface DocumentationMembershipProps {
    headerTitle?: string;
    headerCaption?: React.ReactNode;
    highlight?: number;
    nav?: React.ReactNode;
    docs?: DocumentationItem[];
    imageSource?: boolean;
    docsTitle?: string;
    mulltyDocs?: boolean;
    handleContentOpen: (content: { src: string; title: string } | Tutorial) => void;
    tutorialIcon?: string;
    tutorial?: Tutorial;
    showNavigator?: boolean;
    handleScrollToTop: () => void;
}

// Sub-components
interface MembershipBadgeProps {
    label: string;
    enabled: boolean;
    itemId: string;
    value: string;
}

const MembershipBadge: React.FC<MembershipBadgeProps> = ({ label, enabled, itemId, value }) => (
    <Tag
        className={classNames('membership', {
            enabled,
            'disabled': !enabled,
        })}
        key={`${itemId}-${label}-${value}`}
    >
        {label}
    </Tag>
);

interface TutorialButtonProps {
    tutorial: Tutorial;
    icon?: string;
    onClick: (tutorial: Tutorial) => void;
    className?: string;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ tutorial, onClick, className }) => {
    const handleClick = (): void => {
        onClick(tutorial);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className={classNames('tutorial-wrapper', className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Open tutorial: ${tutorial.title || tutorial.text}`}
        >
            <span>{tutorial.text}</span>
            <PlayCircleOutlined />
        </div>
    );
};

interface DocumentationImageProps {
    image: DocumentationImage;
    itemId: string;
    index: number;
    imageSource?: boolean;
}

const DocumentationImageComponent: React.FC<DocumentationImageProps> = ({
    image,
    itemId,
    index,
    imageSource,
}) => {
    const imageClassName = classNames('docs-image', {
        'logo-banner': itemId === 'logo-banner',
        'logo-personalised': itemId === 'personalised-banner',
        'badge-image': image.source,
        'badge-image-height': image.source?.includes('square'),
    });

    const wrapperClassName = classNames({
        'img-wrapper': image.source,
        'img-spread': imageSource,
    });

    return (
        <div className="docs-card-wrapper">
            <div className={wrapperClassName}>
                <img
                    className={imageClassName}
                    src={image.file}
                    alt={image.source || 'Documentation image'}
                    key={`${itemId}-${index}`}
                />
            </div>
            {image.source && (
                <div className="text-alignment">
                    <span className="text">{image.source}</span>
                </div>
            )}
        </div>
    );
};

interface DocumentationItemComponentProps {
    item: DocumentationItem;
    index: number;
    highlight?: number;
    imageSource?: boolean;
    handleContentOpen: (content: { src: string; title: string } | Tutorial) => void;
}

const DocumentationItemComponent: React.FC<DocumentationItemComponentProps> = ({
    item,
    index,
    highlight,
    imageSource,
    handleContentOpen,
}) => {
    // Support both camelCase and kebab-case
    const membershipTypes = item.membershipTypes || (item as { 'membership-types'?: MembershipTypes })['membership-types'];


    return (
        <>
            {item.divider && <div className="divider" />}
            <div className="documentation-item" id={item.id}>
                <Title
                    level={3}
                    className={classNames('documentation-item-title', {
                        "highlighted": highlight === index,
                    })}
                >
                    {item.title}
                </Title>

                <div className="sub-title-wrapper">
                    {membershipTypes && (
                        <div className="type-wrapper">
                            {Object.entries(membershipTypes).map(([label, value]) => (
                                <MembershipBadge
                                    key={`${item.id}-${label}-${value}`}
                                    label={label}
                                    enabled={value === 'Yes'}
                                    itemId={item.id}
                                    value={value}
                                />
                            ))}
                            {item.tutorial && (
                                <TutorialButton
                                    tutorial={item.tutorial}
                                    onClick={handleContentOpen}
                                />
                            )}
                        </div>
                    )}

                    {item.redirect && (
                        <a
                            target="_blank"
                            href={item.redirect.link}
                            className="link-wrapper"
                            rel="noopener noreferrer"
                            aria-label={`Open ${item.redirect.text} in new tab`}
                        >
                            <span className="link-text">{item.redirect.text}</span>
                            <img alt="redirect" src={redirectLinkIcon} />
                        </a>
                    )}
                </div>
                <Markdown>{item.descriptionAbout}</Markdown>
                {item.images && item.images.length > 0 && (
                    <div>
                        {item.images.map((img, i) => (
                            <DocumentationImageComponent
                                key={`${item.id}-image-${i}`}
                                image={img}
                                itemId={item.id}
                                index={i}
                                imageSource={imageSource}
                            />
                        ))}
                    </div>
                )}

                {item.subTitle && (
                    <Markdown className="documentation-sub-title">{item.subTitle}</Markdown>
                )}

                {item.subDescription && (
                    <Markdown
                        className={classNames('documentation-sub-description', {
                            'sub-border': item.border,
                        })}
                    >
                        {item.subDescription}
                    </Markdown>
                )}
            </div>
        </>
    );
};

interface ScrollToTopButtonProps {
    showNavigator: boolean;
    handleScrollToTop: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
    showNavigator,
    handleScrollToTop,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleScrollToTop();
        }
    };

    if (!showNavigator) {
        return null;
    }

    return (
        <div
            className="navigator"
            onClick={handleScrollToTop}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Scroll to top"
        >
            <span className="navigator-logo">
                <ArrowUpOutlined />
            </span>
        </div>
    );
};

// Main component
export const DocumentationMembership: React.FC<DocumentationMembershipProps> = ({
    headerTitle,
    headerCaption,
    highlight,
    nav,
    docs,
    imageSource,
    docsTitle,
    mulltyDocs,
    handleContentOpen,
    tutorial,
    showNavigator,
    handleScrollToTop,
}) => {
    const handleTutorialKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (tutorial) {
                handleContentOpen({
                    src: tutorial.src,
                    title: tutorial.title || '',
                });
            }
        }
    };

    return (
        <div
            className={classNames('documentation-wrapper', {
                'mullty-wrapper': mulltyDocs,
            })}
        >
            {headerTitle && (
                <Title level={2} className="documentation-header">
                    {headerTitle}
                </Title>
            )}
            {headerCaption}
            <div
                className={classNames('placement', {
                    'placement-height': imageSource,
                })}
            >
                {nav ? <React.Fragment key="nav">{nav}</React.Fragment> : null}
                <div
                    key="documentation-inner"
                    className={classNames('documentation-inner-wrapper', {
                        'inner-spacing': mulltyDocs,
                    })}
                >
                    <div className="header-wrapper">
                        {docsTitle && (
                            <h3 className="docs-title">
                                {docsTitle}
                            </h3>
                        )}
                        {tutorial && (
                            <div
                                className="video-wrapper"
                                rel="noreferrer"
                                onClick={() =>
                                    handleContentOpen({
                                        src: tutorial.src,
                                        title: tutorial.title || '',
                                    })
                                }
                                onKeyDown={handleTutorialKeyDown}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open tutorial: ${tutorial.title || tutorial.text}`}
                            >
                                {tutorial?.text}
                                <VideoCameraFilled />
                            </div>
                        )}
                    </div>
                    {docs?.map((item, index) => (
                        <DocumentationItemComponent
                            key={item.id || `doc-${index}`}
                            item={item}
                            index={index}
                            highlight={highlight}
                            imageSource={imageSource}
                            handleContentOpen={handleContentOpen}
                        />
                    ))}
                </div>
                <ScrollToTopButton
                    key="scroll-to-top"
                    showNavigator={showNavigator || false}
                    handleScrollToTop={handleScrollToTop}
                />
            </div>
        </div>
    );
};

