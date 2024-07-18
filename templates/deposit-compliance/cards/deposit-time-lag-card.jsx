import React from 'react'

import { Card } from 'design'
import * as texts from 'texts/depositing'
import TimeLagChart from 'components/time-lag-chart'
import Markdown from 'components/markdown'

const DepositTimeLagCard = ({
  timeLagData,
  isRetrieveDepositDatesInProgress,
}) => (
  <Card tag="section">
    <Card.Title tag="h2">{texts.chart.title}</Card.Title>
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
export default DepositTimeLagCard
