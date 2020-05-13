import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'

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
  viewStatistics,
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
    {viewStatistics != null && <IrusCard statistics={viewStatistics} />}
  </Tag>
)

export default OverviewTemplate
