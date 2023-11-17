import React from 'react'
import { Button, Modal } from '@oacore/design'

import notifications from '../../../components/upload/assets/notificationGuide.svg'
import styles from '../styles.module.css'

import content from 'texts/settings/settings.yml'

const NotificationGuide = ({ modal, handleButtonClick }) => (
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
          <div className={styles.notificationDescription}>
            {content.notificationGuide.description}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {Object.values(content.notificationGuide.actions).map((button) => (
            <Button
              key={button.action}
              onClick={handleButtonClick}
              variant={button.type}
              className={styles.actionButton}
            >
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  </div>
)

export default NotificationGuide
