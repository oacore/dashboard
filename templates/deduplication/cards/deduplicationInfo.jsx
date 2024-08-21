import React from 'react'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import { formatDate, valueOrDefault } from '../../../utils/helpers'

import { Card } from 'design'

const DeduplicationInfoCard = ({ harvestingStatus }) => (
  <Card
    className={styles.deduplicationInfoCardWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.headerWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.info.title}
      </Card.Title>
    </div>
    <div className={styles.innerWrapper}>
      <span className={styles.text}>
        {valueOrDefault(
          formatDate(harvestingStatus?.lastHarvestingDate),
          'Loading...'
        )}
      </span>
    </div>
    <Card.Description className={styles.cardDescription}>
      {texts.info.description}
    </Card.Description>
  </Card>
)
export default DeduplicationInfoCard
