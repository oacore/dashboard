import React from 'react'

import content from '../../../texts/settings'
import { Button, Card } from '../../../design'
import styles from '../styles.module.css'
import successHarvesting from '../../../components/upload/assets/successHarvesting.svg'
import faillHarvesting from '../../../components/upload/assets/faillHarvesting.svg'

const NotificationPopUp = ({
  displayedNotifications,
  seenNotification,
  seeAllNotifications,
  userID,
}) => {
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

  const getAllNotifications = (userId, id) => {
    seenNotification(userId, id)
  }
  const seeAll = (id) => {
    seeAllNotifications(id)
  }

  return (
    <Card className={styles.popUp} tag="section">
      {displayedNotifications?.map((item) => (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          className={styles.popUpItem}
          onClick={() => getAllNotifications(userID, item.id)}
        >
          <p className={styles.popUpItemText}>{renderMessage(item.type)}</p>
          <p className={styles.createdDate}>{formatDate(item.createdDate)}</p>
          {!item?.notificationRead?.readStatus && (
            <div className={styles.status} />
          )}
        </div>
      ))}
      <div className={styles.buttonWrapper}>
        <Button
          key={content.notifications.actions.read.name}
          onClick={() => seeAll(userID)}
          variant={content.notifications.actions.read.variant}
          className={styles.actionButton}
        >
          {content.notifications.actions.read.name}
        </Button>
      </div>
    </Card>
  )
}

export default NotificationPopUp
