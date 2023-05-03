import React from 'react'

import styles from '../styles.module.css'
import question from '../../../components/upload/assets/question.svg'

import { Card } from 'design'
import * as texts from 'texts/deduplication'

const DeduplicationStatistics = () => (
  <Card
    className={styles.deduplicationStatisticsWrapper}
    tag="section"
    title={texts.deduplication.info.title}
  >
    <div className={styles.statisticsHeaderWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.deduplication.statistics.title}
      </Card.Title>
      <img src={question} alt="question" />
    </div>
    <div className={styles.statisticsBody}>
      <span className={styles.subTitle}>
        {texts.deduplication.statistics.countTitle}
      </span>
      <div className={styles.graph} />
      <div className={styles.subTitleWrapper}>
        <span className={styles.subTitle}>
          {texts.deduplication.info.subTitle}
        </span>
      </div>
    </div>
  </Card>
)

export default DeduplicationStatistics
