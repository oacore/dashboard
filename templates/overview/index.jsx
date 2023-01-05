import React, { useEffect, useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'
import RioxxCard from './cards/rioxx-card'
import DashboardGuide from '../../components/dashboard-tutorial/dashboardGuide'
import useDashboardGuideStore from '../../components/dashboard-tutorial/dashboard-tutorial.store'

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
  dataProviderInstitution,
  countryCode,
  harvestingDate,
  errorCount,
  warningCount,
  viewStatistics,
  rioxxCompliance,
  className,
  dataProviderData,
  tag: Tag = 'main',
  ...restProps
}) => {
  const [shouldRender, setShouldRender] = useState(false)
  const dashboardGuideStore = useDashboardGuideStore()
  useEffect(() => {
    const t = localStorage.getItem('onboardingDone')
    setShouldRender(t === 'true')
  }, [shouldRender])

  const modal = useRef(null)
  const { pathname } = window.location

  useEffect(() => {
    if (
      pathname === `/data-providers/${dataProviderData.id}/overview` &&
      !shouldRender
    )
      dashboardGuideStore.openModal()
  }, [pathname])

  return (
    <Tag
      className={classNames.use(styles.container).join(className)}
      {...restProps}
    >
      <div className={styles.header}>
        <Title>{dataProviderName}</Title>
        <p className={styles.subtitle}>{dataProviderInstitution}</p>
      </div>

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
      {dashboardGuideStore.currentStep === 1 && (
        <DashboardGuide dataProviderData={dataProviderData} modal={modal} />
      )}
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
      {doiCount && (
        <DoiCard
          outputsCount={metadataCount}
          doiCount={doiCount}
          downloadUrl={doiDownloadUrl}
          enrichmentSize={doiEnrichmentSize}
          dataProviderId={dataProviderId}
        />
      )}
    </Tag>
  )
}

export default OverviewTemplate
