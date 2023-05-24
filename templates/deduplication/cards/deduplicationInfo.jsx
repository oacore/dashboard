import React from 'react'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import texts from '../../../texts/deduplication/deduplication.yml'
import { formatDate, valueOrDefault } from '../../../utils/helpers'

import { Button, Card } from 'design'

const DeduplicationInfoCard = ({ duplicateList, harvestingStatus }) => (
  <Card
    className={styles.deduplicationInfoCardWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.headerWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.info.title}
      </Card.Title>
      <Actions description={texts.info.info} />
    </div>
    <div className={styles.deduplicationBody}>
      <div className={styles.innerWrapper}>
        <span className={styles.subTitle}>{texts.info.subTitle}</span>
        <span className={styles.text}>
          {valueOrDefault(
            formatDate(harvestingStatus?.lastHarvestingDate),
            'Loading...'
          )}
        </span>
      </div>
      <div className={styles.innerWrapper}>
        <span className={styles.subTitle}>{texts.info.countTitle}</span>
        <span className={styles.text}>{duplicateList.count}</span>
      </div>
    </div>
    <div className={styles.deduplicationFooter}>
      <Card.Description className={styles.cardDescription}>
        {texts.info.description}
      </Card.Description>
      <Button className={styles.footerButton} tag="a" variant="contained">
        {texts.info.action}
      </Button>
    </div>
  </Card>
)

export default DeduplicationInfoCard
