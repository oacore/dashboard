import React from 'react'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import Actions from '../../../components/actions'
import ExportButton from '../../../components/export-button'

import { Card } from 'design'

const DeduplicationStatistics = ({ duplicateList, duplicatesUrl }) => (
  <Card
    className={styles.deduplicationStatisticsWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.numberHeaderWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.info.countTitle}
      </Card.Title>
      <Actions className={styles.actionItem} description={texts.info.info} />
    </div>
    <div className={styles.innerWrapper}>
      <span className={styles.innerSubTitle}>{texts.info.subTitle}</span>
      <span className={styles.text}>{duplicateList.count}</span>
      <ExportButton
        href={duplicatesUrl}
        className={styles.footerButton}
        variant="contained"
      >
        {texts.info.action}
      </ExportButton>
    </div>
  </Card>
)

export default DeduplicationStatistics
