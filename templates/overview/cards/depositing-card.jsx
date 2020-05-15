import React from 'react'

import styles from '../styles.module.css'
import OverviewCard from './overview-card'

import * as texts from 'texts/overview'
import { valueOrDefault } from 'utils/helpers'
import TimeLagChart from 'components/time-lag-chart'
import LinkButton from 'components/link-button'
import { Card } from 'design'

const Loading = ({ children = 'Loading...', tag: Tag = 'p', ...restProps }) => (
  <Tag {...restProps}>{children}</Tag>
)

const getDescriptionForDepositingCard = (complianceLevel) => {
  const { description } = texts.depositing
  let chartDescription
  if (
    complianceLevel === null ||
    (complianceLevel > 0 && complianceLevel < 100)
  ) {
    chartDescription = description.complianceLevel.render({
      amount: valueOrDefault(
        complianceLevel && (100 - complianceLevel).toFixed(2),
        'loading...'
      ),
    })
  } else if (complianceLevel === 0)
    chartDescription = description.allNonCompliant.render()
  else chartDescription = description.allCompliant.render()

  return chartDescription
}

const filterChartData = (data, complianceLevel = 0.75) => {
  const dataLimit = 365 * 4
  const complianceLimit = 90

  const leftLimit =
    complianceLimit + Math.floor(dataLimit * complianceLevel) * -1
  const rightLimit = leftLimit + dataLimit

  return data.filter(
    (item) =>
      item.depositTimeLag >= leftLimit && item.depositTimeLag <= rightLimit
  )
}

const Content = ({ chartData, complianceLevel, dataProviderId }) =>
  chartData.length === 0 ? (
    <p>{texts.depositing.description.missingData}</p>
  ) : (
    <>
      <TimeLagChart
        className={styles.chart}
        data={filterChartData(chartData, complianceLevel / 100)}
        height={200}
      />
      <p>{getDescriptionForDepositingCard(complianceLevel)}</p>
      <LinkButton
        href="deposit-compliance"
        dataProviderId={dataProviderId}
        className={styles.linkButton}
      >
        {texts.depositing.action}
      </LinkButton>
    </>
  )

const DepositingCard = ({ chartData, complianceLevel, dataProviderId }) => (
  <OverviewCard>
    <Card.Title tag="h2">{texts.depositing.title}</Card.Title>
    {chartData == null || complianceLevel == null ? (
      <Loading />
    ) : (
      <Content
        complianceLevel={complianceLevel}
        chartData={chartData}
        dataProviderId={dataProviderId}
      />
    )}
  </OverviewCard>
)

export default DepositingCard
