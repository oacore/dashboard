import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'

import styles from '../styles.module.css'
import { Button } from '../../../design'
import done from '../../../components/upload/assets/done.svg'
import failed from '../../../components/upload/assets/failed.svg'
import Markdown from '../../../components/markdown'
import loadingImg from '../../../components/upload/assets/loading.svg'
import content from '../../../texts/settings'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = ({
  harvestingStatus,
  sendHarvestingRequest,
}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const dayInterval = (lastHarvestingDateString) => {
    const lastHarvestingDate = new Date(lastHarvestingDateString)
    const currentDate = new Date()
    const timeDifference = currentDate - lastHarvestingDate
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference > 10
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
        <Button onClick={() => sendRequest()} variant="contained">
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
      <div className={styles.requestDateWrapper}>
        {errorMessage && (
          <div className={styles.errorItem}>
            <img
              src={failed}
              alt={texts.progress.subTitle}
              className={styles.errorImage}
            />
            <Markdown className={styles.status}>{errorMessage}</Markdown>
          </div>
        )}
        {success &&
          result &&
          harvestingStatus?.scheduledState === 'PENDING' && (
            <div className={styles.statusWrapper}>
              <img
                src={done}
                alt={texts.progress.subTitle}
                className={styles.image}
              />
              <Markdown className={styles.status}>
                {texts.type.scheduled.success}
              </Markdown>
            </div>
          )}
        {success && harvestingStatus?.scheduledState !== 'PENDING' && (
          <div className={styles.statusWrapper}>
            <img
              src={done}
              alt={texts.progress.subTitle}
              className={styles.image}
            />
            <Markdown className={styles.status}>
              {texts.type.progress.success}
            </Markdown>
          </div>
        )}
        {success &&
          !result &&
          harvestingStatus?.scheduledState === 'PENDING' && (
            <div className={styles.statusWrapper}>
              <img
                src={done}
                alt={texts.progress.subTitle}
                className={styles.image}
              />
              <Markdown className={styles.status}>
                {texts.type.finished.success}
              </Markdown>
            </div>
          )}
      </div>
      <div className={styles.statusDescription}>
        {texts.progress.description}
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
                  !errorMessage &&
                  result &&
                  harvestingStatus?.scheduledState === 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
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
                  !errorMessage &&
                  harvestingStatus?.scheduledState !== 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                harvestingStatus?.scheduledState !== 'PENDING',
            })}
          >
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
                  !errorMessage &&
                  !result &&
                  harvestingStatus?.scheduledState === 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                !result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            {texts.type.finished.title}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default HarvestingProgressCard
