import React from 'react';
import { Button, Typography } from 'antd';
import info from '@/assets/icons/info.svg';
import Markdown from '../Markdown/Markdown';
import './styles.css';

const { Text } = Typography;

export interface DashboardTipMessageProps {
    title?: string;
    show: string;
    hide: string;
    description: string;
    activeText: boolean;
    setText: (value: boolean) => void;
}

const DashboardTipMessage: React.FC<DashboardTipMessageProps> = ({
    title,
    show,
    hide,
    description,
    setText,
    activeText,
}) => (
    <div>
        <div className={`table-title-wrapper ${!title ? 'no-wrapper' : ''}`}>
            {!activeText && (
                <div
                    className={`show-wrapper ${!title ? 'no-show-wrapper' : ''}`}
                    role="button"
                    onClick={() => setText(true)}
                >
                    <Text className="table-title">{show}</Text>
                    <img className="show-icon" src={info} alt="description" />
                </div>
            )}
        </div>
        {activeText && (
            <div className="data-error-wrapper">
                <div className="data-error-inner-wrapper">
                    <img className="nfo-icon" src={info} alt="description" />
                    <div className="info-text">
                        <Markdown>{description}</Markdown>
                    </div>
                </div>
                <div className="hide-button-wrapper">
                    <Button
                        className="hide-button"
                        onClick={() => setText(false)}
                        variant="outlined"
                    >
                        {hide}
                    </Button>
                </div>
            </div>
        )}
    </div>
);

export default DashboardTipMessage;
