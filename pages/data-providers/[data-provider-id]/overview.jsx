import React from 'react'

import OverviewTemplate from 'templates/overview'
import { withGlobalStore } from 'store'

const Overview = ({ store, ...props }) => (
  <OverviewTemplate
    metadataCount={store.dataProvider?.statistics?.metadataCount}
    fullTextCount={store.dataProvider?.statistics?.fullTextCount}
    timeLagData={store.dataProvider?.depositDates?.timeLagData}
    isTimeLagDataLoading={
      store.dataProvider?.depositDates?.isRetrieveDepositDatesInProgress
    }
    complianceLevel={store.dataProvider?.depositDates?.complianceLevel}
    doiCount={store.dataProvider?.doi?.originCount}
    doiEnrichmentSize={store.dataProvider?.doi?.enrichmentSize}
    dataProviderId={store.dataProvider.id}
    countryCode={store.dataProvider?.location?.countryCode}
    harvestingDate={
      store.dataProvider?.issues?.harvestingStatus?.lastHarvestingDate
    }
    errorCount={store.dataProvider?.issues?.aggregation?.errorsCount}
    warningCount={store.dataProvider?.issues?.aggregation?.warningsCount}
    viewStatistics={store.dataProvider?.irus}
    rioxxCompliance={store.dataProvider?.rioxx}
    {...props}
  />
)

export default withGlobalStore(Overview)
