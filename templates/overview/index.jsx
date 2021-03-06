import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'
import RioxxCard from './cards/rioxx-card'

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
  countryCode,
  harvestingDate,
  errorCount,
  warningCount,
  viewStatistics,
  rioxxCompliance,
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
      countryCode={countryCode}
    />
    <DoiCard
      outputsCount={metadataCount}
      doiCount={doiCount}
      enrichmentSize={doiEnrichmentSize}
      dataProviderId={dataProviderId}
    />
    {rioxxCompliance != null && rioxxCompliance.totalCount > 0 && (
      <RioxxCard compliance={rioxxCompliance} />
    )}
    {viewStatistics != null && <IrusCard statistics={viewStatistics} />}
  </Tag>
)

export default OverviewTemplate
