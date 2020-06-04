import React from 'react'

import OverviewTemplate from 'templates/overview'
import { withGlobalStore } from 'store'

const Overview = ({ store, ...props }) => (
  <OverviewTemplate
    metadataCount={store.statistics.metadataCount}
    fullTextCount={store.statistics.fullTextCount}
    timeLagData={store.depositDates.timeLagData}
    isTimeLagDataLoading={store.depositDates.isRetrieveDepositDatesInProgress}
    complianceLevel={store.depositDates.complianceLevel}
    doiCount={store.doi.originCount}
    doiEnrichmentSize={store.doi.enrichmentSize}
    dataProvider={store.dataProvider.id}
    countryCode={store.dataProvider?.location?.countryCode}
    harvestingDate={store.issues.harvestingStatus?.lastHarvestingDate}
    errorCount={store.issues.aggregation?.errorsCount}
    warningCount={store.issues.aggregation?.warningsCount}
    viewStatistics={store.irus}
    rioxxCompliance={store.rioxx}
    {...props}
  />
)

export default withGlobalStore(Overview)
