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

const DepositingCard = ({ chartData, complianceLevel, dataProviderId }) => {
  const { title, description, action } = texts.depositing
  const loading = chartData == null && complianceLevel == null
  const chartDescription = getDescriptionForDepositingCard(complianceLevel)

  const content =
    chartData && chartData.length > 0 ? (
      <>
        <TimeLagChart className={styles.chart} data={chartData} height={200} />
        <p>{chartDescription}</p>
        <LinkButton
          href="deposit-compliance"
          dataProviderId={dataProviderId}
          className={styles.linkButton}
        >
          {action}
        </LinkButton>
      </>
    ) : (
      <p>{description.missingData}</p>
    )

  return (
    <OverviewCard>
      <Card.Title tag="h2">{title}</Card.Title>
      {loading ? <Loading /> : content}
    </OverviewCard>
  )
}

export default DepositingCard
