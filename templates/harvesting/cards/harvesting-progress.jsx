import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'

import styles from '../styles.module.css'
import { Button } from '../../../design'
import loadingImg from '../../../components/upload/assets/loading.svg'
import content from '../../../texts/settings'
import HarvestingModal from './harvesting-modal'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = ({
  harvestingStatus,
  sendHarvestingRequest,
}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const dayInterval = (lastHarvestingDateString) => {
    const lastHarvestingDate = new Date(lastHarvestingDateString)
    const currentDate = new Date()
    const timeDifference = currentDate - lastHarvestingDate
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference > 7
  }

  const result = dayInterval(harvestingStatus?.lastHarvestingDate)

  const sendRequest = async () => {
    try {
      setLoading(true)
      await sendHarvestingRequest()
      setSuccess(true)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error sending harvesting request:', error)
      setSuccess(false)
      if (error.response) setErrorMessage(texts.type.error.success)
    } finally {
      setLoading(false)
    }
  }

  const triggerModal = () => {
    setModalOpen(true)
  }

  const handleButtonClose = () => {
    setModalOpen(false)
  }

  return (
    <Card className={styles.progressWrapper}>
      <div
        className={classNames.use(styles.titleWrapper, {
          [styles.titleOption]: !success,
          [styles.errorMessage]: errorMessage,
        })}
      >
        <Card.Title className={styles.maiTitle} tag="h2">
          {texts.progress.title}
        </Card.Title>
      </div>
      <div className={styles.requestDateWrapper}>
        {/* {modalOpen && ( */}
        {/*  <HarvestingModal */}
        {/*    title={texts.modal.error.title} */}
        {/*    description={texts.modal.error.description} */}
        {/*    placeholder={texts.modal.error.input} */}
        {/*    handleButtonClose={handleButtonClose} */}
        {/*    handleButtonClick={sendRequest} */}
        {/*  /> */}
        {/* )} */}
        {modalOpen &&
          harvestingStatus?.scheduledState === 'IN_DOWNLOAD_METADATA_QUEUE' && (
            <HarvestingModal
              title={texts.modal.scheduled.title}
              description={texts.modal.scheduled.description}
              placeholder={texts.modal.scheduled.input}
              handleButtonClose={handleButtonClose}
              handleButtonClick={sendRequest}
            />
          )}
        {modalOpen &&
          !result &&
          harvestingStatus?.scheduledState === 'PENDING' && (
            <HarvestingModal
              title={texts.modal.progress.title}
              description={texts.modal.progress.description}
              placeholder={texts.modal.progress.input}
              handleButtonClose={handleButtonClose}
              handleButtonClick={sendRequest}
            />
          )}
        {modalOpen &&
          result &&
          harvestingStatus?.scheduledState !== 'PENDING' && (
            <HarvestingModal
              title={texts.modal.finished.title}
              description={texts.modal.finished.description}
              placeholder={texts.modal.finished.input}
              handleButtonClose={handleButtonClose}
              handleButtonClick={sendRequest}
            />
          )}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.scheduled.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  harvestingStatus?.scheduledState ===
                  'IN_DOWNLOAD_METADATA_QUEUE',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                harvestingStatus?.scheduledState ===
                'IN_DOWNLOAD_METADATA_QUEUE',
            })}
          >
            {/* CHECK Scheduled */}
            {texts.type.scheduled.title}
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.progress.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  !result && harvestingStatus?.scheduledState === 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                !result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            {/* im progress */}
            {texts.type.progress.title}
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.finished.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  result && harvestingStatus?.scheduledState !== 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                result && harvestingStatus?.scheduledState !== 'PENDING',
            })}
          >
            {/* finished */}
            {texts.type.finished.title}
          </span>
        </div>
      </div>
      <div className={styles.statusDescription}>
        {texts.progress.description}
      </div>
      <div className={styles.buttonWrapper}>
        <Button onClick={triggerModal} variant="contained">
          {loading ? (
            <div className={styles.spinnerWrapper}>
              <span>Loading</span>
              <img
                className={styles.rotate}
                src={loadingImg}
                alt={content.notifications.title}
              />
            </div>
          ) : (
            texts.progress.action
          )}
        </Button>
      </div>
    </Card>
  )
}

export default HarvestingProgressCard
