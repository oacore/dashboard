import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'
import RioxxCard from './cards/rioxx-card'

import Title from 'components/title'

const OverviewTemplate = ({
  metadataCount,
  metadatadaHistory,
  fullTextCount,
  timeLagData,
  isTimeLagDataLoading,
  complianceLevel,
  doiCount,
  doiDownloadUrl,
  doiEnrichmentSize,
  dataProviderId,
  dataProviderName,
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
    <Title>{dataProviderName}</Title>
    <DataStatisticsCard
      metadatadaHistory={metadatadaHistory}
      metadataCount={metadataCount}
      fullTextCount={fullTextCount}
      harvestingDate={harvestingDate}
      errorCount={errorCount}
      warningCount={warningCount}
      dataProviderId={dataProviderId}
      viewStatistics={viewStatistics}
    />
    <DepositingCard
      chartData={timeLagData}
      complianceLevel={complianceLevel}
      dataProviderId={dataProviderId}
      countryCode={countryCode}
    />

    {rioxxCompliance != null && rioxxCompliance.totalCount > 0 && (
      <RioxxCard compliance={rioxxCompliance} />
    )}
    {viewStatistics != null && <IrusCard statistics={viewStatistics} />}
    <DoiCard
      outputsCount={metadataCount}
      doiCount={doiCount}
      downloadUrl={doiDownloadUrl}
      enrichmentSize={doiEnrichmentSize}
      dataProviderId={dataProviderId}
    />
  </Tag>
)

export default OverviewTemplate
