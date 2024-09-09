import React from 'react'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import { formatDate, valueOrDefault } from '../../../utils/helpers'
import info from '../../../components/upload/assets/info.svg'

import { Card } from 'design'

const DeduplicationInfoCard = ({ harvestingStatus, harvestingError }) => (
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
      {harvestingError ? (
        <div className={styles.errorsWrapper}>
          <img className={styles.infoIcon} src={info} alt="riox" />
          <p className={styles.errorText}>This data is not available now. </p>
        </div>
      ) : (
        <span className={styles.text}>
          {valueOrDefault(
            formatDate(harvestingStatus?.lastHarvestingDate),
            'Loading...'
          )}
        </span>
      )}
    </div>
    <Card.Description className={styles.cardDescription}>
      {texts.info.description}
    </Card.Description>
  </Card>
)
export default DeduplicationInfoCard
