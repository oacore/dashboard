import React from 'react'

import styles from '../styles.module.css'
import { rrs } from '../../../texts/rrs-retention'
import { formatNumber } from '../../../utils/helpers'
import { Button } from '../../../design'

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

const RrsStatsCard = () => (
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
    <div className={styles.innerWrapper}>
      {/* <span className={styles.text}> */}
      {/*  {valueOrDefault('from bc', 'Loading...')} */}
      {/* </span> */}
    </div>
    <Card.Description className={styles.cardDescription}>
      {rrs.statsCard.description}
    </Card.Description>
    <ProgressBar count={945} maxCount={2345} />
    <div className={styles.footerWrapper}>
      <Button variant="contained">{rrs.statsCard.action}</Button>
      <span className={styles.subFooter}>{formatNumber(2345)} outputs</span>
    </div>
  </Card>
)

export default RrsStatsCard
