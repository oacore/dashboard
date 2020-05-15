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
      chartData={timeLagData}
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
