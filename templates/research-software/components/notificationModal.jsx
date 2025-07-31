import React from 'react'
import { Button, Modal } from '@oacore/design'

import styles from './styles.module.css'
import Markdown from '../../../components/markdown'

const NotificationModal = ({
  title,
  description,
  action,
  handleButtonClose,
}) => (
  <div>
    <Modal aria-label="modal" hideManually>
      <div className={styles.modalWrapper}>
        <h5 className={styles.modalTitle}>{title}</h5>
        <Markdown className={styles.modalDescription}>{description}</Markdown>
        <div className={styles.endButton}>
          <Button
            onClick={handleButtonClose}
            variant="contained"
            className={styles.button}
          >
            {action}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
)

export default NotificationModal
