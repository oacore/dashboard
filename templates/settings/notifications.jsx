import React from 'react'

import { Card, Switch, useSwitch } from '../../design'
import styles from './styles.module.css'
import content from '../../texts/settings'
import notification from './assets/notification.svg'

const NotificationsPageTemplate = () => {
  const [checked, setChecked] = useSwitch(false)

  const toggleResolving = () => {
    setChecked(!checked)
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
        <div className={styles.notificationContainer}>
          <Switch
            className={styles.toggler}
            // id="activated"
            checked={checked}
            onChange={toggleResolving}
            label={content.notifications.types.type}
          />
          <div className={styles.cardWrapper}>
            <div className={styles.typeWrapper}>
              <input type="checkbox" />
              <span className={styles.notificationTypeText}>
                {content.notifications.types.notifyOne}
              </span>
            </div>
            <div className={styles.typeWrapper}>
              <input type="checkbox" />
              <span className={styles.notificationTypeText}>
                {content.notifications.types.notifyTwo}
              </span>
            </div>
            <div className={styles.optionWrapper}>
              {Object.values(content.notifications.types.items).map((item) => (
                <div className={styles.option}>
                  <input type="radio" />
                  <span className={styles.notificationTypeText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default NotificationsPageTemplate
