import React from 'react'
import { Button, Modal } from '@oacore/design'

import styles from './styles.module.css'
import Markdown from '../../../components/markdown'
import email from '../../../components/upload/assets/emailConfirmation.svg'

const NotificationModal = ({
  title,
  description,
  action,
  handleButtonClose,
}) => (
  <div>
    <Modal aria-label="modal" hideManually>
      <div className={styles.successContent}>
        <h5 className={styles.modalTitle}>{title}</h5>
        <div className={styles.imgWrapper}>
          <img src={email} alt="email" />
        </div>
        <Markdown className={styles.modalDescription}>{description}</Markdown>
      </div>

      <div className={styles.buttonGroup}>
        <Button
          onClick={handleButtonClose}
          variant="contained"
          className={styles.closeButton}
        >
          {action}
        </Button>
      </div>
    </Modal>
  </div>
)

export default NotificationModal
