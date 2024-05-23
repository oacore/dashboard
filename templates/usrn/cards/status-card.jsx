import React from 'react'

import styles from '../styles.module.css'
import TextUSRN from '../../../components/usrn-text'

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
    {Object.keys(texts.status.statusItems).map((key) => (
      <TextUSRN
        key={`TextUSRN ${key}`}
        content={texts.status.statusItems[key]}
        className={styles}
      />
    ))}
  </Card>
)

export default StatusCard
