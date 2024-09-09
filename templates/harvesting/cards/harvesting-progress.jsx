import React, { useContext, useState, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'
import { observer } from 'mobx-react-lite'

import info from '../../../components/upload/assets/info.svg'
import { GlobalContext } from '../../../store'
import styles from '../styles.module.css'
import { Button, ProgressSpinner } from '../../../design'
import loadingImg from '../../../components/upload/assets/loading.svg'
import greenTick from '../../../components/upload/assets/greenTick.svg'
import content from '../../../texts/settings'
import HarvestingModal from './harvesting-modal'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = observer(
  ({ harvestingStatus, sendHarvestingRequest, harvestingError }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [renderedContent, setRenderedContent] = useState(null)

    const dayInterval = (lastHarvestingDateString) => {
      const lastHarvestingDate = new Date(lastHarvestingDateString)
      const currentDate = new Date()
      const timeDifference = currentDate - lastHarvestingDate
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      return daysDifference > 7
    }
    const result = dayInterval(harvestingStatus?.lastHarvestingDate)
    const sendRequest = async (requestText) => {
      try {
        if (!requestText.trim()) {
          setErrorMessage('This field is mandatory')
          return
        }
        setLoading(true)
        setModalOpen(false)
        await sendHarvestingRequest(requestText)
        await globalStore.dataProvider.issues.getHarvestingStatus(true)
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
      if (!loading) setModalOpen(true)
    }

    const handleButtonClose = () => {
      setModalOpen(false)
    }

    // eslint-disable-next-line consistent-return
    const renderView = () => {
      const lastHarvestingDate = new Date(
        harvestingStatus?.lastHarvestingRequestDate
      )
      const currentDate = new Date()

      const differenceInTime =
        currentDate.getTime() - lastHarvestingDate.getTime()
      const differenceInDays = differenceInTime / (1000 * 3600 * 24)
      if (differenceInDays > 5 || !lastHarvestingDate) {
        return (
          <Button
            className={classNames.use({
              [styles.cursorDisable]: loading,
            })}
            onClick={triggerModal}
            variant="contained"
          >
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
        )
      }
      if (differenceInDays < 5) {
        return (
          <div className={styles.warningWrapper}>
            <img className={styles.tick} src={greenTick} alt="" />
            {`Your request has been submitted and the CORE Team has been informed.
            You last sent a harvesting request on ${
              harvestingStatus?.lastHarvestingRequestDate?.split(' ')[0]
            }`}
          </div>
        )
      }
    }

    const getContent = () => {
      if (harvestingError) {
        return (
          <div className={styles.errorsWrapper}>
            <img className={styles.infoIcon} src={info} alt="riox" />
            <p className={styles.errorText}>
              Request reindexing is not available at the moment.
            </p>
          </div>
        )
      }
      if (!harvestingStatus) {
        return (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>Loading...</p>
          </div>
        )
      }
      return <div className={styles.buttonWrapper}>{renderView()}</div>
    }

    useEffect(() => {
      setRenderedContent(getContent())
    }, [harvestingError, harvestingStatus])

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
          {modalOpen &&
            harvestingStatus?.scheduledState === 'IN_DOWNLOAD_METADATA_QUEUE' &&
            !result && (
              <HarvestingModal
                title={texts.modal.scheduled.title}
                description={texts.modal.scheduled.description}
                placeholder={texts.modal.scheduled.input}
                handleButtonClose={handleButtonClose}
                handleButtonClick={sendRequest}
              />
            )}
          {modalOpen &&
            (!result || harvestingStatus?.scheduledState === 'PENDING') && (
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
                      'IN_DOWNLOAD_METADATA_QUEUE' && !result,
                })}
              />
            </Popover>
            <span
              className={classNames.use(styles.progressText, {
                [styles.progressTextActive]:
                  harvestingStatus?.scheduledState ===
                    'IN_DOWNLOAD_METADATA_QUEUE' && !result,
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
                    (!result &&
                      harvestingStatus?.scheduledState !==
                        'IN_DOWNLOAD_METADATA_QUEUE') ||
                    harvestingStatus?.scheduledState === 'PENDING',
                })}
              />
            </Popover>
            <span
              className={classNames.use(styles.progressText, {
                [styles.progressTextActive]:
                  (!result &&
                    harvestingStatus?.scheduledState !==
                      'IN_DOWNLOAD_METADATA_QUEUE') ||
                  harvestingStatus?.scheduledState === 'PENDING',
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
              {texts.type.finished.title}
            </span>
          </div>
        </div>
        <div className={styles.statusDescription}>
          {texts.progress.description}
        </div>
        {renderedContent}
      </Card>
    )
  }
)

export default HarvestingProgressCard
