import React, { useRef, useEffect } from 'react'

import content from '../../../texts/settings'
import { Button, Card } from '../../../design'
import styles from '../styles.module.css'
import successHarvesting from '../../../components/upload/assets/successHarvesting.svg'
import faillHarvesting from '../../../components/upload/assets/faillHarvesting.svg'
import greenArrow from '../../../components/upload/assets/greenArrowBig.svg'

const NotificationPopUp = ({
  displayedNotifications,
  userID,
  handleNotificationClick,
  closeNotification,
  dataProviderId,
  notifications,
}) => {
  const popupRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target))
        closeNotification()
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [closeNotification])
  const renderMessage = (type) => {
    if (type === 'harvest-completed') {
      return (
        <div className={styles.harvestingItem}>
          <img src={successHarvesting} alt="successHarvesting" />
          <span className={styles.harvestingType}>
            Harvesting has been successfully completed
          </span>
        </div>
      )
    }
    if (type === 'harvest-failed') {
      return (
        <div className={styles.harvestingItem}>
          <img src={faillHarvesting} alt="faillHarvesting" />
          <span className={styles.harvestingType}>
            Harvesting was not completed because of issues that required your
            actions
          </span>
        </div>
      )
    }
    if (type === 'duplicates')
      return 'New potential duplicates of your records have been found'

    return ''
  }

  const formatDate = (backendDate) => {
    const date = new Date(backendDate)

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }

    const formattedDate = date.toLocaleDateString('en-GB', options)
    return formattedDate.replace(/\//g, '.')
  }

  return (
    <div ref={popupRef}>
      <Card className={styles.popUp} tag="section">
        {notifications ? (
          <>
            {displayedNotifications?.map((item) => (
              // eslint-disable-next-line max-len
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
              <div
                className={styles.popUpItem}
                onClick={() =>
                  handleNotificationClick(userID, item.id, dataProviderId)
                }
              >
                <p className={styles.popUpItemText}>
                  {renderMessage(item.type)}
                </p>
                <p className={styles.createdDate}>
                  {formatDate(item.createdDate)}
                </p>
                {!item?.notificationRead?.readStatus ? (
                  <div className={styles.status} />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
            ))}
            <div className={styles.buttonWrapper}>
              <Button
                key={content.notifications.actions.read.name}
                onClick={() => handleNotificationClick(userID, 'all')}
                variant={content.notifications.actions.read.variant}
                className={styles.actionButton}
              >
                {content.notifications.actions.read.name}
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.noNotifications}>
            <img src={greenArrow} alt="Logo" className={styles.logo} />
            <h5 className={styles.noNotificationsTitle}>
              {content.notifications.noNotifications.title}
            </h5>
            <span className={styles.noNotificationsText}>
              {content.notifications.noNotifications.description}
            </span>
            <Button
              onClick={() => closeNotification()}
              variant={content.notifications.noNotifications.action.variant}
              className={styles.noNotificationsActionButton}
            >
              {content.notifications.noNotifications.action.title}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default NotificationPopUp
