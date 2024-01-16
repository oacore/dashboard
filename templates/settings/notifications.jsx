import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import { Card } from '../../design'
import styles from './styles.module.css'
import content from '../../texts/settings'
import notification from './assets/notification.svg'
import notificationsOff from './assets/notificationsOffs.svg'
import HarvestingNotification from './cards/harvestingNotification'
import DeduplicationNotification from './cards/dedupliactionNotifications'

const NotificationsPageTemplate = observer(
  ({
    updateNotifications,
    userId,
    organisationId,
    dataProviderId,
    deleteNotifications,
    getNotifications,
    harvestNotifications,
    deduplicationNotifications,
  }) => {
    const [harvestingSwitch, setHarvestingSwitch] = useState(false)

    const [deduplicationSwitch, setDeduplicationSwitch] = useState(false)

    // eslint-disable-next-line max-len
    const [harvestingNotificationsPending, setHarvestingNotificationsPending] =
      useState(false)

    const [
      deduplicationNotificationsPending,
      setDeduplicationNotificationsPending,
    ] = useState(false)

    const handleHarvestingOptionDelete = async () => {
      setHarvestingNotificationsPending(true)
      try {
        await deleteNotifications(
          {
            organisationId,
            userId,
            type: 'harvest-completed',
          },
          'harvest-completed'
        )
        setHarvestingSwitch(false)
      } catch (error) {
        console.error('Error deleting notifications:', error)
      } finally {
        setHarvestingNotificationsPending(false)
      }
    }

    const handleDeduplicationOptionDelete = async () => {
      setDeduplicationNotificationsPending(true)
      try {
        await deleteNotifications(
          {
            organisationId,
            userId,
            type: 'deduplication-completed',
          },
          'deduplication-completed'
        )
        setDeduplicationSwitch(false)
      } catch (error) {
        console.error('Error deleting notifications:', error)
      } finally {
        setDeduplicationNotificationsPending(false)
      }
    }

    const handleDelete = () => {
      handleHarvestingOptionDelete()
      handleDeduplicationOptionDelete()
    }

    const handleHarvestingOptionChange = async (newSelectedOption) => {
      setHarvestingNotificationsPending(true)
      try {
        await updateNotifications(
          {
            organisationId,
            type: 'harvest-completed',
            datetimeInterval: newSelectedOption,
          },
          'harvest-completed'
        )
      } catch (error) {
        console.error('Error updating notifications:', error)
      } finally {
        setHarvestingNotificationsPending(false)
      }
    }

    const handleDeduplicationOptionChange = async (newSelectedOption) => {
      setDeduplicationNotificationsPending(true)
      try {
        await updateNotifications(
          {
            organisationId,
            type: 'deduplication-completed',
            datetimeInterval: newSelectedOption,
          },
          'deduplication-completed'
        )
      } catch (error) {
        console.error('Error updating notifications:', error)
      } finally {
        setDeduplicationNotificationsPending(false)
      }
    }

    const toggleHarvestingSwitch = () => {
      setHarvestingSwitch((prevSwitch) => {
        const newSwitch = !prevSwitch
        if (newSwitch) {
          handleHarvestingOptionChange(
            content.notifications.types.harvesting.radio[0].key
          )
        } else handleHarvestingOptionDelete()

        return newSwitch
      })
    }

    const toggleDeduplicationSwitch = () => {
      setDeduplicationSwitch((prevSwitch) => {
        const newSwitch = !prevSwitch
        if (newSwitch) {
          handleDeduplicationOptionChange(
            content.notifications.types.deduplication.radio[0].key
          )
        } else handleDeduplicationOptionDelete()

        return newSwitch
      })
    }

    const handleToggle = () => {
      toggleHarvestingSwitch()
      toggleDeduplicationSwitch()
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          await getNotifications(userId, organisationId, 'harvest-completed')
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      }

      fetchData()
    }, [])

    useEffect(() => {
      const fetchData = async () => {
        try {
          await getNotifications(
            userId,
            organisationId,
            'deduplication-completed'
          )
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      }

      fetchData()
    }, [])

    useEffect(() => {
      setHarvestingSwitch(
        harvestNotifications?.data[0]?.type === 'harvest-completed'
      )
    }, [harvestNotifications])

    useEffect(() => {
      setDeduplicationSwitch(
        // eslint-disable-next-line max-len
        deduplicationNotifications?.data[0]?.type === 'deduplication-completed'
      )
    }, [deduplicationNotifications])

    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
        <h1 className={styles.settingCardTitle} />
        <Card className={styles.section} tag="section">
          <div className={styles.headerWrapper}>
            <Card.Title tag="h2">{content.notifications.title}</Card.Title>
            {harvestingSwitch || deduplicationSwitch ? (
              // eslint-disable-next-line max-len
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
              <div
                onClick={
                  harvestingNotificationsPending ||
                  deduplicationNotificationsPending
                    ? null
                    : handleDelete
                }
                className={classNames.use(styles.notificationWrapper, {
                  [styles.disabled]:
                    harvestingNotificationsPending ||
                    deduplicationNotificationsPending,
                })}
              >
                <img src={notification} alt={content.notifications.title} />
                <span
                  className={classNames.use(styles.notificationText, {
                    [styles.disabled]:
                      harvestingNotificationsPending ||
                      deduplicationNotificationsPending,
                  })}
                >
                  {content.notifications.subAction}
                </span>
              </div>
            ) : (
              // eslint-disable-next-line max-len
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
              <div
                onClick={handleToggle}
                className={classNames.use(styles.notificationWrapper, {
                  [styles.disabled]:
                    harvestingNotificationsPending ||
                    deduplicationNotificationsPending,
                })}
              >
                <img src={notificationsOff} alt={content.notifications.title} />
                <span className={styles.notificationTextDisable}>
                  {content.notifications.subActionDisabled}
                </span>
              </div>
            )}
          </div>
          <span className={styles.headerSubTitle}>
            {content.notifications.subTitle}
          </span>
          <div className={styles.mainWrapper}>
            <HarvestingNotification
              label={
                <span className={styles.switchTitle}>
                  {content.notifications.types.harvesting.type}
                </span>
              }
              title={content.notifications.types.harvesting.notifyOne}
              subTitle={content.notifications.types.harvesting.notifyTwo}
              options={Object?.values(
                content.notifications.types.harvesting.radio
              )}
              checked={harvestingSwitch}
              onChange={toggleHarvestingSwitch}
              id="harvesting"
              name="harvesting"
              updateNotifications={updateNotifications}
              handleOptionChange={handleHarvestingOptionChange}
              dataProviderId={dataProviderId}
              harvestNotifications={harvestNotifications}
              deduplicationNotifications={deduplicationNotifications}
              updateNotificationsPending={harvestingNotificationsPending}
              harvestingNotificationsPending={harvestingNotificationsPending}
            />
            <DeduplicationNotification
              label={
                <span className={styles.switchTitle}>
                  {content.notifications.types.deduplication.type}
                </span>
              }
              title={content.notifications.types.deduplication.notifyOne}
              subTitle={content.notifications.types.deduplication.notifyTwo}
              options={Object?.values(
                content.notifications.types.deduplication.radio
              )}
              checked={deduplicationSwitch}
              onChange={toggleDeduplicationSwitch}
              id="deduplication"
              name="deduplication"
              updateNotifications={updateNotifications}
              handleOptionChange={handleDeduplicationOptionChange}
              dataProviderId={dataProviderId}
              harvestNotifications={harvestNotifications}
              deduplicationNotifications={deduplicationNotifications}
              // eslint-disable-next-line max-len
              updateNotificationsPending={deduplicationNotificationsPending}
              deduplicationNotificationsPending={
                deduplicationNotificationsPending
              }
            />
          </div>
        </Card>
      </>
    )
  }
)

export default NotificationsPageTemplate
