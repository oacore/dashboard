import React, { useContext } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import { formatDate, valueOrDefault } from '../../../utils/helpers'
import checked from '../../../components/upload/assets/checkGreen.svg'
import { GlobalContext } from '../../../store'
import TextWithTooltip from '../../../components/textWithTooltip/textWithtooltip'

import { Card } from 'design'

const DeduplicationInfoCard = ({ harvestingStatus }) => {
  const { ...globalStore } = useContext(GlobalContext)
  return (
    <Card
      className={styles.deduplicationInfoCardWrapper}
      tag="section"
      title={texts.info.title}
    >
      <div
        className={classNames.use(styles.headerWrapper, {
          [styles.setHeaderWrapper]: globalStore.setSelectedItem,
        })}
      >
        <Card.Title className={styles.cardTitle} tag="h2">
          {texts.info.title}
        </Card.Title>
        <div>
          {globalStore?.setSelectedItem && (
            <div>
              <img src={checked} alt="" />
              <span className={styles.setName}>
                <TextWithTooltip
                  className={styles.setName}
                  text={globalStore.setSelectedItem.setName}
                />
              </span>
            </div>
          )}
        </div>
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
}

export default DeduplicationInfoCard
