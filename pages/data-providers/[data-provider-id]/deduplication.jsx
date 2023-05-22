import React from 'react'

import DeduplicationPageTemplate from '../../../templates/deduplication'

import { withGlobalStore } from 'store'

const DeduplicationPage = ({ store, ...props }) => (
  <DeduplicationPageTemplate
    getDeduplicationData={store.dataProvider?.getDeduplicationData}
    harvestingStatus={store.dataProvider?.issues?.harvestingStatus}
    duplicateList={store.dataProvider?.duplicateList}
    getDeduplicationInfo={store.dataProvider?.getDeduplicationInfo}
    duplicateListDetails={store.dataProvider?.duplicateListDetails}
    getOutputsData={store.dataProvider?.getOutputsData}
    outputData={store.dataProvider?.outputData}
    getWorksData={store.dataProvider?.getWorksData}
    workData={store.dataProvider?.workData}
    updateWork={store.dataProvider?.updateWork}
    duplicatesUrl={store.dataProvider?.duplicatesUrl}
    exportUrl={store.dataProvider?.works?.contentExportUrl}
    {...props}
  />
)

export default withGlobalStore(DeduplicationPage)
