import React, { useState } from 'react';
import { Typography } from 'antd';
import {  ArrowRightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Markdown } from '@oacore/core-ui';
import './styles.css';

const { Text } = Typography;

// Types
export interface NavItem {
    item: string;
    href: string;
    hidden?: boolean;
}

export interface TextData {
    navItems: {
        [key: string]: NavItem;
    };
}

export interface DocumentationMembershipNavProps {
    textData: TextData;
    setHighlight: (index: number) => void;
    activeIndex: number | null;
    setNavActiveIndex: (index: number | null) => void;
    mulltyDocs?: boolean;
}

export const DocumentationMembershipNav: React.FC<DocumentationMembershipNavProps> = ({
    textData,
    setHighlight,
    activeIndex,
    setNavActiveIndex,
    mulltyDocs,
}) => {
    const [activeItem, setActiveItem] = useState<number | null>(null);

    const headerHeight = 56;
    const mobileHeaderHeight = 150;

    const handleClick = (obj: NavItem, item: number): void => {
        window.location.href = obj.href;
        setActiveItem(item);
        setHighlight(item);
        setNavActiveIndex(null);

        const element = document.getElementById(obj.href.replace('#', ''));

        if (element) {
            const rect = element.getBoundingClientRect();
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const adjustedHeaderHeight = isMobile ? mobileHeaderHeight : headerHeight;

            window.scrollTo({
                top: rect.top + window.scrollY - adjustedHeaderHeight,
                behavior: 'smooth',
            });
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLLIElement>,
        obj: NavItem,
        item: number
    ): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(obj, item);
        }
    };

    const isItemActive = (index: number): boolean => {
        if (activeIndex === null) {
            return activeItem === index;
        }
        return activeIndex === index;
    };

    return (
        <div
            className={classNames({
                'sider-wrapper': mulltyDocs,
            })}
        >
            {mulltyDocs && (
                <div className="sider-header">
                    <Text strong>Outline</Text>
                </div>
            )}
            <div className="sider">
                {Object.values(textData.navItems).map((item, i) => {
                    if (item.hidden) {
                        return null;
                    }
                    const isActive = isItemActive(i);
                    return (
                        <li
                            key={item.href || i}
                            className={classNames('sider-item', {
                                'active-item': isActive,
                            })}
                            onClick={() => handleClick(item, i)}
                            onKeyDown={(e) => handleKeyDown(e, item, i)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Navigate to ${item.item}`}
                        >
                            <Markdown className="sider-item-link">{item.item}</Markdown>
                            {isActive && (
                                <span className="nav-indicator" aria-hidden="true">
                                    <ArrowRightOutlined />
                                </span>
                            )}
                        </li>
                    );
                })}
            </div>
        </div>
    );
};
