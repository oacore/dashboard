import React from 'react';
import { Button, Spin } from 'antd';
import classNames from 'classnames';
import externalLink from '@/assets/icons/externalLink.svg';
import { CloseOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import "./styles.css"

export interface StatusAction {
    title: string;
    button: string;
    key: number;
}

export interface StatusModalTexts {
    title: string;
    link: string;
}

export interface CrStatusCardTexts {
    statusModal: StatusModalTexts;
    statusActions: StatusAction[];
}

export interface CrStatusCardProps {
    handleStatusUpdate: (e: React.MouseEvent, articleId: string, key: number) => void;
    statusSentence: string;
    loadingStatus: boolean;
    href: string;
    articleId: string;
    texts: CrStatusCardTexts;
}

const CrStatusCard: React.FC<CrStatusCardProps> = ({
    handleStatusUpdate,
    statusSentence,
    loadingStatus,
    href,
    articleId,
    texts,
}) => {
    return (
        <div className="cr-status-card-modal-wrapper">
            <div className="cr-status-card-spin-title-wrapper">
                <h3 className="cr-status-card-modal-title">{texts.statusModal.title}</h3>
                {loadingStatus && (
                    <div className="cr-status-card-spinner-wrapper">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}
            </div>
            <div className="cr-status-card-confirmation-popup">{statusSentence}</div>
            <div className="cr-status-card-redirect">
                <a
                    className="cr-status-card-redirect-btn"
                    target="_blank"
                    href={href}
                    rel="noreferrer"
                >
                    <span>{texts.statusModal.link}</span>
                    <img src={externalLink} alt="" />
                </a>
            </div>
            <div className="cr-status-card-modal-footer">
                {texts.statusActions.map(({ button, key }) => (
                    <Button
                        key={key}
                        onClick={(e) => handleStatusUpdate(e, articleId, key)}
                        className={classNames('cr-status-card-modal-footer-btn', {
                            'cr-status-card-modal-footer-n': button === 'WRONG',
                            'cr-status-card-modal-footer-y': button !== 'WRONG',
                        })}
                    >
                        {button}
                        {button === 'WRONG' ? (
                            <CloseOutlined />
                        ) : (
                            <CheckOutlined />
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CrStatusCard;
