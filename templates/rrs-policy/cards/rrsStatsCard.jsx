import React from 'react'

import styles from '../styles.module.css'
import { formatNumber } from '../../../utils/helpers'
import { Button } from '../../../design'

import rrs from 'texts/rrs-retention'
import { Card } from 'design'

const RrsStatsCard = ({ rrsUrl, rrsList, rrsDataLoading }) => (
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
    {rrsDataLoading ? (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingStroke} />
      </div>
    ) : (
      <div className={styles.subFooter}>
        {formatNumber(rrsList.length)} outputs
      </div>
    )}
    <div className={styles.footerWrapper}>
      <Button href={rrsUrl} variant="contained">
        {rrs.statsCard.action}
      </Button>
    </div>
  </Card>
)

export default RrsStatsCard
