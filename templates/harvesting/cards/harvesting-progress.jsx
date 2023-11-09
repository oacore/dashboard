import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import { Button } from '../../../design'
import done from '../../../components/upload/assets/done.svg'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = ({ harvestingStatus }) => {
  const dayInterval = (lastHarvestingDateString) => {
    const lastHarvestingDate = new Date(lastHarvestingDateString)
    const currentDate = new Date()
    const timeDifference = currentDate - lastHarvestingDate
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference > 7
  }

  const result = dayInterval(harvestingStatus?.lastHarvestingDate)

  return (
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
      <div className={styles.statusDescription}>
        {texts.progress.description}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressItem}>
          <div
            className={classNames.use(styles.progressCircle, {
              [styles.progressCircleActive]:
                result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          />
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            Scheduled
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <div
            className={classNames.use(styles.progressCircle, {
              [styles.progressCircleActive]:
                harvestingStatus?.scheduledState !== 'PENDING',
            })}
          />
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                harvestingStatus?.scheduledState !== 'PENDING',
            })}
          >
            In progress
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <div
            className={classNames.use(styles.progressCircle, {
              [styles.progressCircleActive]:
                !result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          />
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                !result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            Finished
          </span>
        </div>
      </div>
    </Card>
  )
}

export default HarvestingProgressCard
