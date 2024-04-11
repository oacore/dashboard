import React from 'react'
import { Button, Modal } from '@oacore/design'

import styles from '../styles.module.css'
import Markdown from '../../../components/markdown'

import content from 'texts/settings/settings.yml'

const HarvestingModal = ({
  title,
  description,
  modal,
  handleButtonClick,
  handleButtonClose,
  placeholder,
}) => (
  <div ref={modal}>
    <Modal aria-label="modal" hideManually>
      <div className={styles.modalWrapper}>
        <h5 className={styles.modalTitle}>{title}</h5>
        <Markdown className={styles.modalDescription}>{description}</Markdown>
        <textarea
          id="request"
          className={styles.input}
          placeholder={placeholder}
          name="request"
          required
        />
        <span className={styles.wordCount}>Max 150 words.</span>
        <div className={styles.buttonGroup}>
          <Button
            key={content.notificationGuide.actions.offAction.title}
            onClick={handleButtonClick}
            variant={content.notificationGuide.actions.onAction.type}
            className={styles.button}
          >
            send
          </Button>
          <Button
            key={content.notificationGuide.actions.onAction.title}
            onClick={handleButtonClose}
            variant={content.notificationGuide.actions.offAction.type}
            className={styles.button}
          >
            cancel
          </Button>
        </div>
      </div>
    </Modal>
  </div>
)

export default HarvestingModal
