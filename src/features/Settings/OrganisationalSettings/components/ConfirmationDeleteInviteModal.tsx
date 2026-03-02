import React from 'react';
import { Modal, Button } from 'antd';
import Markdown from '@components/common/Markdown/Markdown';
import { patchValue } from '@utils/helpers';
import notificationText from '@features/Settings/texts';
import type { InviteItem } from '../store/organisationStore';
import '../styles.css';

interface ConfirmationDeleteInviteModalProps {
    open: boolean;
    item: InviteItem | null;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ConfirmationDeleteInviteModal: React.FC<ConfirmationDeleteInviteModalProps> = ({
    open,
    item,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!item) {
        return null;
    }

    return (
        <Modal
            className="delete-modal"
            open={open}
            closable={false}
            title={notificationText.invite.confirmation.title}
            onCancel={onCancel}
            footer={[
                <Button key="yes" type="primary" onClick={onConfirm} loading={loading} className="confirmation-modal-btn-yes">
                    Yes
                </Button>,
                <Button key="no" onClick={onCancel} className="confirmation-modal-btn-no">
                    No
                </Button>,
            ]}
            centered
            width={500}
        >
            <div className="confirmation-modal-content">
                <Markdown className="confirmation-popup">
                    {patchValue(notificationText.invite.confirmation.content, { email: item.email })}
                </Markdown>
            </div>
        </Modal>
    );
};

