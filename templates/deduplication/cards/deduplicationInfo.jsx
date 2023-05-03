import React from 'react'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'

import { Button, Card } from 'design'
import * as texts from 'texts/deduplication'

const DeduplicationInfoCard = () => (
  <Card
    className={styles.deduplicationInfoCardWrapper}
    tag="section"
    title={texts.deduplication.info.title}
  >
    <div className={styles.headerWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.deduplication.info.title}
      </Card.Title>
      <Actions description="temp" />
    </div>
    <div className={styles.deduplicationBody}>
      <div className={styles.innerWrapper}>
        <span className={styles.subTitle}>
          {texts.deduplication.info.subTitle}
        </span>
        <span className={styles.text}>31.05.2021</span>
      </div>
      <div className={styles.innerWrapper}>
        <span className={styles.subTitle}>
          {texts.deduplication.info.countTitle}
        </span>
        <span className={styles.text}>576</span>
      </div>
    </div>
    <div className={styles.deduplicationFooter}>
      <Card.Description className={styles.cardDescription}>
        {texts.deduplication.info.description}
      </Card.Description>
      <Button className={styles.footerButton} tag="a" variant="contained">
        {texts.deduplication.info.action}
      </Button>
    </div>
  </Card>
)

export default DeduplicationInfoCard
