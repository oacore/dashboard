import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import {
  PlaceholderCard,
  DataStatisticsCard,
  DoiCard,
  DepositingCard,
} from './cards'

import Title from 'components/title'

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

const OverviewTemplate = ({
  metadataCount,
  fullTextCount,
  timeLagData,
  isTimeLagDataLoading,
  complianceLevel,
  doiCount,
  doiEnrichmentSize,
  dataProviderId,
  harvestingDate,
  errorCount,
  warningCount,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <Title hidden>Overview</Title>
    <DataStatisticsCard
      metadataCount={metadataCount}
      fullTextCount={fullTextCount}
      harvestingDate={harvestingDate}
      errorCount={errorCount}
      warningCount={warningCount}
      dataProviderId={dataProviderId}
    />
    <DepositingCard
      chartData={
        timeLagData &&
        complianceLevel &&
        filterChartData(timeLagData, complianceLevel / 100)
      }
      complianceLevel={complianceLevel}
      dataProviderId={dataProviderId}
    />
    <DoiCard
      outputsCount={metadataCount}
      doiCount={doiCount}
      enrichmentSize={doiEnrichmentSize}
      dataProviderId={dataProviderId}
    />
    <PlaceholderCard title="ORCiDs" value={5.8} />
  </Tag>
)

export default OverviewTemplate
