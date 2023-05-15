import React from 'react'

import styles from '../styles.module.css'
import question from '../../../components/upload/assets/question.svg'
import texts from '../../../texts/deduplication/deduplication.yml'

import { Card } from 'design'

const DeduplicationStatistics = () => (
  <Card
    className={styles.deduplicationStatisticsWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.statisticsHeaderWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.statistics.title}
      </Card.Title>
      <img src={question} alt="question" />
    </div>
    <div className={styles.statisticsBody}>
      <span className={styles.subTitle}>{texts.statistics.countTitle}</span>
      <div className={styles.graph} />
      <div className={styles.subTitleWrapper}>
        <span className={styles.subTitle}>{texts.info.subTitle}</span>
      </div>
    </div>
  </Card>
)

export default DeduplicationStatistics
