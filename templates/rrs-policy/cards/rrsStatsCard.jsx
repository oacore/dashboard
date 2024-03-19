import React from 'react'

import styles from '../styles.module.css'
import { formatNumber } from '../../../utils/helpers'
import { Button } from '../../../design'

import rrs from 'texts/rrs-retention'
import { Card } from 'design'

const ProgressBar = ({ count, maxCount }) => {
  const percentage = (count / maxCount) * 100

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBarInner}
        style={{ width: `${percentage}%` }}
      />
      <div className={styles.progressBarLabel}>{`${Math.round(
        percentage
      )}%`}</div>
    </div>
  )
}
const RrsStatsCard = ({ rrsUrl, rrsList }) => {
  const outputsWithRrsList = rrsList.filter(
    (item) =>
      item.validationStatusRRS !== 0 && item.validationStatusRRS !== undefined
  )

  return (
    <Card
      className={styles.cardWrapper}
      tag="section"
      title={rrs.statsCard.title}
    >
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          {rrs.statsCard.title}
        </Card.Title>
      </div>
      <div className={styles.innerWrapper} />
      <Card.Description className={styles.cardDescription}>
        {rrs.statsCard.description}
      </Card.Description>
      <ProgressBar
        count={outputsWithRrsList.length}
        maxCount={rrsList.length}
      />
      <div className={styles.footerWrapper}>
        <Button href={rrsUrl} variant="contained">
          {rrs.statsCard.action}
        </Button>
        <span className={styles.subFooter}>
          {formatNumber(outputsWithRrsList.length)} outputs
        </span>
      </div>
    </Card>
  )
}

export default RrsStatsCard
