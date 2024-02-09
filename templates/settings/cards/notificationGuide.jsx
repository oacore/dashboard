import React from 'react'
import { Button, Modal } from '@oacore/design'

import notifications from '../../../components/upload/assets/notificationGuide.svg'
import styles from '../styles.module.css'
import Markdown from '../../../components/markdown'

import content from 'texts/settings/settings.yml'

const NotificationGuide = ({ modal, handleButtonClick, handleButtonClose }) => (
  <div ref={modal}>
    <Modal aria-label="modal" hideManually>
      <div className={styles.notificationGuideWrapper}>
        <h5 className={styles.notificationTitle}>
          {content.notificationGuide.title}
        </h5>
        <div className={styles.notificationGuideInnerWrapper}>
          <img
            className={styles.notificationImage}
            src={notifications}
            alt=""
          />
          <Markdown className={styles.notificationDescription}>
            {content.notificationGuide.description}
          </Markdown>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            key={content.notificationGuide.actions.offAction.title}
            onClick={handleButtonClose}
            variant={content.notificationGuide.actions.offAction.type}
            className={styles.actionButton}
          >
            {content.notificationGuide.actions.offAction.title}
          </Button>
          <Button
            key={content.notificationGuide.actions.onAction.title}
            onClick={handleButtonClick}
            variant={content.notificationGuide.actions.onAction.type}
            className={styles.actionButton}
          >
            {content.notificationGuide.actions.onAction.title}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
)

export default NotificationGuide
