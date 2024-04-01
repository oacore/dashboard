import React from 'react'

import DeduplicationPageTemplate from '../../../templates/deduplication'

import { withGlobalStore } from 'store'

const DeduplicationPage = ({ store, ...props }) => (
  <DeduplicationPageTemplate
    getDeduplicationData={store.dataProvider?.getDeduplicationData}
    duplicateDataLoading={store.dataProvider?.duplicateDataLoading}
    harvestingStatus={store.dataProvider?.issues?.harvestingStatus}
    duplicateList={store.dataProvider?.duplicateList}
    getDeduplicationInfo={store.dataProvider?.getDeduplicationInfo}
    duplicateListDetails={store.dataProvider?.duplicateListDetails}
    getOutputsData={store.dataProvider?.getOutputsData}
    outputData={store.dataProvider?.outputData}
    clearOutputsData={store.dataProvider?.clearOutputsData}
    getWorksData={store.dataProvider?.getWorksData}
    workData={store.dataProvider?.workData}
    updateWork={store.dataProvider?.updateWork}
    duplicatesUrl={store.dataProvider?.duplicatesUrl}
    exportUrl={store.dataProvider?.works?.contentExportUrl}
    billingPlan={store.organisation.billingPlan}
    dataProviderData={store.dataProvider}
    {...props}
  />
)

export default withGlobalStore(DeduplicationPage)
