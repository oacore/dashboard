import React from 'react'

import content from '../../../texts/settings'
import { Button, Card } from '../../../design'
import styles from '../styles.module.css'

const NotificationPopUp = () => (
  <Card className={styles.popUp} tag="section">
    {Object.values(content.notifications.messages).map((item) => (
      <p className={styles.popUpText}>{item}</p>
    ))}
    <div className={styles.buttonWrapper}>
      {Object.values(content.notifications.actions).map((action) => (
        <Button
          key={action.action}
          variant={action.variant}
          className={styles.actionButton}
        >
          {action.name}
        </Button>
      ))}
    </div>
  </Card>
)

export default NotificationPopUp
