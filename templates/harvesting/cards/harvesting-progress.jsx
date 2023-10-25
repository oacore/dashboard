import React from 'react'

import styles from '../styles.module.css'
import { Button } from '../../../design'
import done from '../../../components/upload/assets/done.svg'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = () => (
  <Card className={styles.progressWrapper}>
    <div className={styles.titleWrapper}>
      <Card.Title className={styles.maiTitle} tag="h2">
        {texts.progress.title}
      </Card.Title>
      <Button variant="contained">{texts.progress.action}</Button>
    </div>
    <div className={styles.requestDateWrapper}>
      <span className={styles.requestTitle}>{texts.progress.subTitle}</span>
      <span className={styles.requestDate}>31.05.2023</span>
      <div className={styles.statusWrapper}>
        <img
          src={done}
          alt={texts.progress.subTitle}
          className={styles.image}
        />
        <span className={styles.status}>Successful harvesting</span>
      </div>
    </div>
    <div className={styles.statusDescription}>{texts.progress.description}</div>
    <div className={styles.progressBar}>
      <div className={styles.progressItem}>
        <div className={styles.progressCircle} />
        <span className={styles.progressText}>Scheduled</span>
      </div>
      <div className={styles.border} />
      <div className={styles.progressItem}>
        <div className={styles.progressCircle} />
        <span className={styles.progressText}>In progress</span>
      </div>
      <div className={styles.border} />
      <div className={styles.progressItem}>
        <div className={styles.progressCircle} />
        <span className={styles.progressText}>Finished</span>
      </div>
    </div>
  </Card>
)

export default HarvestingProgressCard
