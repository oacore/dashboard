import React, { useState } from 'react'

import { Card } from '../../design'
import styles from './styles.module.css'
import content from '../../texts/settings'
import notification from './assets/notification.svg'
import Notification from './cards/notification'

const NotificationsPageTemplate = () => {
  const [switches, setSwitches] = useState({
    harvestingSwitch: false,
    deduplicationSwitch: false,
  })

  const toggleSwitch = (switchName) => {
    setSwitches((prevSwitches) => ({
      ...prevSwitches,
      [switchName]: !prevSwitches[switchName],
    }))
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h1 className={styles.settingCardTitle} />
      <Card className={styles.section} tag="section">
        <div className={styles.headerWrapper}>
          <Card.Title tag="h2">{content.notifications.title}</Card.Title>
          <div className={styles.notificationWrapper}>
            <img src={notification} alt={content.notifications.title} />
            <span className={styles.notificationText}>
              {content.notifications.subAction}
            </span>
          </div>
        </div>
        <span className={styles.headerSubTitle}>
          {content.notifications.subTitle}
        </span>
        <div className={styles.mainWrapper}>
          <Notification
            label={
              <span className={styles.switchTitle}>
                {content.notifications.types.harvesting.type}
              </span>
            }
            title={content.notifications.types.harvesting.notifyOne}
            subTitle={content.notifications.types.harvesting.notifyTwo}
            options={Object?.values(
              content.notifications.types.harvesting.items
            )}
            checked={switches.harvestingSwitch}
            onChange={() => toggleSwitch('harvestingSwitch')}
            id="harvesting"
            name="harvestingOptions"
          />
          <Notification
            label={
              <span className={styles.switchTitle}>
                {content.notifications.types.deduplication.type}
              </span>
            }
            title={content.notifications.types.deduplication.notifyOne}
            subTitle={content.notifications.types.deduplication.notifyTwo}
            options={Object?.values(
              content.notifications.types.deduplication.items
            )}
            checked={switches.deduplicationSwitch}
            onChange={() => toggleSwitch('deduplicationSwitch')}
            id="deduplication"
            name="deduplicationOptions"
          />
        </div>
      </Card>
    </>
  )
}

export default NotificationsPageTemplate
