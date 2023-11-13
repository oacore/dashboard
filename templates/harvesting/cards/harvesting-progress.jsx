import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'

import styles from '../styles.module.css'
import { Button } from '../../../design'
import done from '../../../components/upload/assets/done.svg'

import { Card } from 'design'
import texts from 'texts/issues'

const HarvestingProgressCard = ({
  harvestingStatus,
  sendHarvestingRequest,
}) => {
  const dayInterval = (lastHarvestingDateString) => {
    const lastHarvestingDate = new Date(lastHarvestingDateString)
    const currentDate = new Date()
    const timeDifference = currentDate - lastHarvestingDate
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference > 7
  }

  const result = dayInterval(harvestingStatus?.lastHarvestingDate)

  const sendRequest = async () => {
    await sendHarvestingRequest()
  }
  return (
    <Card className={styles.progressWrapper}>
      <div className={styles.titleWrapper}>
        <Card.Title className={styles.maiTitle} tag="h2">
          {texts.progress.title}
        </Card.Title>
        <Button onClick={() => sendRequest()} variant="contained">
          {texts.progress.action}
        </Button>
      </div>
      <div className={styles.requestDateWrapper}>
        <div className={styles.statusWrapper}>
          <img
            src={done}
            alt={texts.progress.subTitle}
            className={styles.image}
          />
          <span className={styles.status}>{texts.type.scheduled.success}</span>
        </div>
      </div>
      <div className={styles.statusDescription}>
        {texts.progress.description}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.scheduled.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  result && harvestingStatus?.scheduledState === 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            {texts.type.scheduled.title}
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.progress.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  harvestingStatus?.scheduledState !== 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                harvestingStatus?.scheduledState !== 'PENDING',
            })}
          >
            {texts.type.progress.title}
          </span>
        </div>
        <div className={styles.border} />
        <div className={styles.progressItem}>
          <Popover
            className={styles.popover}
            placement="top"
            content={texts.type.finished.tooltip}
          >
            <div
              className={classNames.use(styles.progressCircle, {
                [styles.progressCircleActive]:
                  !result && harvestingStatus?.scheduledState === 'PENDING',
              })}
            />
          </Popover>
          <span
            className={classNames.use(styles.progressText, {
              [styles.progressTextActive]:
                !result && harvestingStatus?.scheduledState === 'PENDING',
            })}
          >
            {texts.type.finished.title}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default HarvestingProgressCard
