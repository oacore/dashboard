import "./styles.css"
import React from 'react';
import { Button } from 'antd';
import { SettingFilled } from '@ant-design/icons';

interface CrHeaderProps {
    title: string;
    description?: string;
    identifier?: string;
    showMore?: React.ReactNode;
    children?: React.ReactNode;
    showSettingsIcon?: boolean;
    showSettings?: boolean;
    onSettingsToggle?: () => void;
}

export const CrHeader: React.FC<CrHeaderProps> = ({
    title,
    description,
    identifier,
    showMore,
    children,
    showSettingsIcon = false,
    showSettings = false,
    onSettingsToggle
}) => (
    <header className="header">
        <div className="main-header-wrapper">
            <h1 className="title">{title}</h1>
            {identifier && <div className="beta">{identifier}</div>}
        </div>
        {description && (
            <div className="description">{description}</div>
        )}
        {showMore}
        {showSettingsIcon && onSettingsToggle && (
            <Button
                type="text"
                className="sw-gearBtn"
                onClick={onSettingsToggle}
                aria-label={showSettings ? 'Close settings' : 'Open settings'}
                icon={<SettingFilled />}
            />
        )}
        {children}
    </header>
)

