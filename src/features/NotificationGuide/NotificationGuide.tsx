import React from 'react';
import { Modal, Button } from 'antd';
import Markdown from '@components/common/Markdown/Markdown';
import texts from './texts/notificationGuide.json';
import notificationGuide from '@/assets/icons/notificationGuide.svg';
import { useNotificationGuideStore } from './store/notificationGuideStore';
import "./styles.css";

interface NotificationGuideProps {
  handleButtonClick: () => void;
  handleButtonClose: () => void;
}

export const NotificationGuide: React.FC<NotificationGuideProps> = ({
  handleButtonClick,
  handleButtonClose,
}) => {
  const { isModalOpen } = useNotificationGuideStore();

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleButtonClose}
      footer={null}
      closable={false}
      maskClosable={false}
      aria-label="modal"
      className="notification-guide-modal"
      centered
      width="auto"
      styles={{
        body: { padding: 0 },
        content: {
          padding: '16px',
          borderRadius: "2px",
          maxWidth: '42rem',
        },
      }}
    >
      <div className="notification-guide-wrapper">
        <h5 className="notification-title">
          {texts.title}
        </h5>
        <div className="notification-guide-inner-wrapper">
          <img
            className="notification-image"
            src={notificationGuide}
            alt=""
          />
          <Markdown className="notification-description">
            {texts.description}
          </Markdown>
        </div>
        <div className="button-group">
          <Button
            key={texts.actions.offAction.title}
            onClick={handleButtonClose}
            type="text"
            className="notification-button"
          >
            {texts.actions.offAction.title}
          </Button>
          <Button
            key={texts.actions.onAction.title}
            onClick={handleButtonClick}
            type={"primary"}
            className="notification-button"
          >
            {texts.actions.onAction.title}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
