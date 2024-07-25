import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/usrn'

const StatusCardClosed = () => (
  <Card tag="section">
    <Card.Title className={styles.statusTitleFirst}>
      {texts.status.usrnClosed}
    </Card.Title>
    <div className={styles.statusLineSplitter} />
  </Card>
)

export default StatusCardClosed
