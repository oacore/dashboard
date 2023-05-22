import React from 'react'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import texts from '../../../texts/deduplication/deduplication.yml'

import { Button, Card } from 'design'

const DeduplicationInfoCard = ({ duplicateList }) => (
  <Card
    className={styles.deduplicationInfoCardWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.headerWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.info.title}
      </Card.Title>
      <Actions description="temp" />
    </div>
    <div className={styles.deduplicationBody}>
      <div className={styles.innerWrapper}>
        <span className={styles.subTitle}>{texts.info.subTitle}</span>
        <span className={styles.text}>31.05.2021</span>
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
