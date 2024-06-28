import React, { useContext } from 'react'

import checked from '../../../components/upload/assets/checkGreen.svg'
import styles from '../styles.module.css'
import { GlobalContext } from '../../../store'
import TextWithTooltip from '../../../components/textWithTooltip/textWithtooltip'

import { Card } from 'design'
import * as texts from 'texts/depositing'
import TimeLagChart from 'components/time-lag-chart'
import Markdown from 'components/markdown'

const DepositTimeLagCard = ({
  timeLagData,
  isRetrieveDepositDatesInProgress,
}) => {
  const { ...globalStore } = useContext(GlobalContext)
  return (
    <Card tag="section">
      <div className={styles.setHeaderWrapper}>
        <Card.Title tag="h2">{texts.chart.title}</Card.Title>
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
      {timeLagData?.length > 0 && (
        <>
          <TimeLagChart data={timeLagData} />
          <Markdown>{texts.chart.body}</Markdown>
        </>
      )}
      {!timeLagData?.length && !isRetrieveDepositDatesInProgress && (
        <p>{texts.noData.body}</p>
      )}
    </Card>
  )
}

export default DepositTimeLagCard
