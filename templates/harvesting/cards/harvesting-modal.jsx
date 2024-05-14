import React, { useState } from 'react'
import { Button, Modal } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import Markdown from '../../../components/markdown'

import content from 'texts/settings/settings.yml'

const HarvestingModal = ({
  title,
  description,
  handleButtonClick,
  handleButtonClose,
  placeholder,
}) => {
  const [requestText, setRequestText] = useState('')
  const [error, setError] = useState('')

  const validateAndSend = () => {
    if (!requestText.trim()) setError('This field is mandatory')
    else {
      setError('')
      handleButtonClick(requestText)
    }
  }

  return (
    <div>
      <Modal aria-label="modal" hideManually>
        <div className={styles.modalWrapper}>
          <h5 className={styles.modalTitle}>{title}</h5>
          <Markdown className={styles.modalDescription}>{description}</Markdown>
          <textarea
            id="request"
            className={classNames.use(styles.input, { [styles.error]: error })}
            placeholder={placeholder}
            name="request"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            required
          />
          <div className={styles.formFooter}>
            {error && <span className={styles.errorMessageText}>{error}</span>}
            <span className={styles.wordCount}>Max 150 words.</span>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              key={content.notificationGuide.actions.offAction.title}
              onClick={validateAndSend}
              variant={content.notificationGuide.actions.onAction.type}
              className={styles.button}
            >
              Send
            </Button>
            <Button
              key={content.notificationGuide.actions.onAction.title}
              onClick={handleButtonClose}
              variant={content.notificationGuide.actions.offAction.type}
              className={styles.button}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default HarvestingModal
