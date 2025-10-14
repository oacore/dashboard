import React from 'react'

import OverviewTemplate from 'templates/overview'
import { withGlobalStore } from 'store'

const Overview = ({ store, ...props }) => (
  <OverviewTemplate
    metadatadaHistory={store.dataProvider?.statistics?.history}
    metadataCount={store.dataProvider?.statistics?.countMetadata}
    fullTextCount={store.dataProvider?.statistics?.countFulltext}
    timeLagData={store.dataProvider?.depositDates?.timeLagData}
    isTimeLagDataLoading={
      store.dataProvider?.depositDates?.isRetrieveDepositDatesInProgress
    }
    complianceLevel={store.dataProvider?.depositDates?.complianceLevel}
    doiCount={store.dataProvider?.doi?.originCount}
    doiDownloadUrl={store.dataProvider?.doi?.doiUrl}
    doiEnrichmentSize={store.dataProvider?.doi?.enrichmentSize}
    dataProviderId={store.dataProvider.id}
    dataProviderName={store.dataProvider.name}
    dataProviderInstitution={store.dataProvider?.institution}
    countryCode={store.dataProvider?.location?.countryCode}
    harvestingDate={
      store.dataProvider?.issues?.harvestingStatus?.lastHarvestingDate
    }
    errorCount={store.dataProvider?.issues?.aggregation?.errorsCount}
    warningCount={store.dataProvider?.issues?.aggregation?.warningsCount}
    viewStatistics={store.dataProvider?.irus}
    rioxxCompliance={store.dataProvider?.rioxx}
    dataProviderData={store.dataProvider}
    tutorial={store.tutorial}
    notificationGuide={store.notificationGuide}
    updateNotifications={store.updateNotifications}
    organisationId={store.organisationId}
    billingPlan={store.organisation.billingPlan}
    {...props}
  />
)
export default withGlobalStore(Overview)
