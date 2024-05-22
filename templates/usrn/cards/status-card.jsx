import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/usrn'
import Markdown from 'components/markdown'

const StatusCard = ({ dateReport }) => (
  <Card tag="section">
    <div className={styles.statusDateReportFirst}>
      {texts.status.dateReport}: {dateReport}
    </div>
    <Card.Title className={styles.statusTitleFirst}>
      {texts.status.titleFirst}
    </Card.Title>
    <div className={styles.statusDescriptionFirst}>
      <Markdown>{texts.status.descriptionFirst}</Markdown>
    </div>
    <div className={styles.statusDateReportSecond}>{dateReport}</div>
    <div className={styles.statusLineSplitter} />
    <div className={styles.statusWrapper}>
      <div className={styles.statusTitleSecond}>{texts.status.titleSecond}</div>
      <div className={styles.statusDescriptionSecond}>
        {texts.status.descriptionSecond}
      </div>
    </div>
  </Card>
)

export default StatusCard
