import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Modal } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import email from '../upload/assets/emailConfirmation.svg'
import message from '../upload/assets/message.svg'
import styles from './styles.module.css'
import content from '../../texts/feedback/feedback.yml'
import Markdown from '../markdown'

const FeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFeedbackClick = () => {
    setIsModalOpen(true)
    setFeedbackText('')
    setIsSubmitted(false)
    setError('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFeedbackText('')
    setIsSubmitted(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      setError('Please enter your feedback')
      return
    }

    if (feedbackText.length > 150) {
      setError('Feedback must be 150 words or less')
      return
    }

    try {
      // Get current page information
      const currentPage = router.asPath
      const pageTitle = document.title || 'Dashboard'

      // Here you would typically send the feedback to your backend
      // For now, we'll just log it and show the success state
      // eslint-disable-next-line no-console
      console.log('Feedback submitted:', {
        feedback: feedbackText,
        page: currentPage,
        pageTitle,
        timestamp: new Date().toISOString(),
      })

      //  can replace this with actual API call:
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     feedback: feedbackText,
      //     page: currentPage,
      //     pageTitle: pageTitle
      //   })
      // })

      setIsSubmitted(true)
      setError('')
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
      console.error('Feedback submission error:', err)
    }
  }

  const handleTextChange = (e) => {
    setFeedbackText(e.target.value)
    if (error) setError('')
  }

  return (
    <>
      <div className={styles.feedbackContainer}>
        <Button
          className={styles.feedbackButton}
          onClick={handleFeedbackClick}
          aria-label="Provide feedback"
          variant="contained"
        >
          <img className={styles.feedbackIcon} src={message} alt="message" />
          <span>Feedback</span>
        </Button>
      </div>

      {isModalOpen && (
        <Modal aria-label="feedback modal" hideManually>
          {!isSubmitted ? (
            <div>
              <div className={styles.wrapper}>
                <h5 className={styles.modalTitle}>
                  {content.feedback.form.title}
                </h5>
                <Markdown className={styles.modalDescription}>
                  {content.feedback.form.description}
                </Markdown>

                <textarea
                  className={classNames.use(styles.input, {
                    [styles.error]: error,
                  })}
                  placeholder={content.feedback.form.placeholder}
                  value={feedbackText}
                  onChange={handleTextChange}
                  maxLength={750}
                  rows={6}
                  required
                />
                <div className={styles.formFooter}>
                  {error && (
                    <span className={styles.errorMessageText}>{error}</span>
                  )}
                  <span className={styles.wordCount}>Max 150 words.</span>
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    onClick={handleSubmit}
                    disabled={!feedbackText.trim()}
                    key={content.feedback.actions.onAction.title}
                    variant={content.feedback.actions.onAction.type}
                    className={styles.button}
                  >
                    {content.feedback.actions.onAction.title}
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    key={content.feedback.actions.offAction.title}
                    variant={content.feedback.actions.offAction.type}
                    className={styles.button}
                  >
                    {content.feedback.actions.offAction.title}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.successContent}>
                <h5 className={styles.modalTitle}>
                  {content.feedback.success.title}
                </h5>
                <div className={styles.imgWrapper}>
                  <img src={email} alt="email" />
                </div>
                <Markdown className={styles.modalDescription}>
                  {content.feedback.success.description}
                </Markdown>
              </div>

              <div className={styles.buttonGroup}>
                <Button
                  onClick={handleCloseModal}
                  key={content.feedback.success.action.title}
                  variant="contained"
                  className={styles.closeButton}
                >
                  {content.feedback.success.action.title}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default FeedbackButton
