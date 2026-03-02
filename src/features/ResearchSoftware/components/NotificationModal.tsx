import React from 'react';
import { Modal, Button } from 'antd';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import '@features/ResearchSoftware/style.css';

interface NotificationModalProps {
    title: string;
    description: string;
    action: string;
    handleButtonClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
    title,
    description,
    action,
    handleButtonClose,
}) => (
    <div>
        <Modal
            open={true}
            onCancel={handleButtonClose}
            footer={null}
            closable={false}
            aria-label="modal"
            className="sw-notification-modal"
            width="100%"
            centered
        >
            <div className="sw-modalWrapper">
                <h5 className="sw-modalTitle">{title}</h5>
                <Markdown className="sw-modalDescription">{description}</Markdown>
                <div className="sw-endButton">
                    <Button
                        onClick={handleButtonClose}
                        type="primary"
                        className="sw-modalButton"
                    >
                        {action}
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
);

