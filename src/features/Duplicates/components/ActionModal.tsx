import React from 'react';
import { Modal, Button } from 'antd';
import Markdown from '@components/common/Markdown/Markdown.tsx';

interface ActionModalProps {
    title: string;
    typeText: string;
    description: string;
    options?: unknown[];
    buttonConfirm: string;
    buttonCancel: string;
    itemId?: string | number;
    onConfirm: () => void;
    onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
    title,
    description,
    buttonConfirm,
    buttonCancel,
    onConfirm,
    onCancel,
}) => (
    <Modal
        open
        centered
        title={title}
        onCancel={onCancel}
        closable={false}
        className="deduplication-action-modal"
        footer={
            <div className="action-modal-footer">
                <Button type="primary" onClick={onConfirm}>
                    {buttonConfirm}
                </Button>
                <Button type="text" onClick={onCancel}>{buttonCancel}</Button>
            </div>
        }
        aria-label={`${title} modal`}
    >
        <Markdown className="action-modal-description">{description}</Markdown>
    </Modal>
);

export default ActionModal;
