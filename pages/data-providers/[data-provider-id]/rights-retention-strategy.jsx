import React from 'react'

import { withGlobalStore } from 'store'
import RrsPageTemplate from 'templates/rrs-policy'

const rrsPolicy = ({ store, ...props }) => (
  <RrsPageTemplate
    rrsList={store.dataProvider?.rrsList}
    getRrslistData={store.dataProvider?.getRrslistData}
    rrsAdditionalData={store.dataProvider?.rrsAdditionalData}
    getOutputsAdditionalData={store.dataProvider?.getOutputsAdditionalData}
    rrsDataLoading={store.dataProvider?.rrsDataLoading}
    rrsAdditionalDataLoading={store.dataProvider?.rrsAdditionalDataLoading}
    metadataCount={store.dataProvider?.statistics?.countMetadata}
    rrsPdfLoading={store.dataProvider?.rrsPdfLoading}
    updateRrsStatus={store.dataProvider?.updateRrsStatus}
    rrsUrl={store.dataProvider?.rrsUrl}
    statusUpdate={store.dataProvider?.statusUpdate}
    uploadPdf={store.dataProvider?.uploadPdf}
    uploadResults={store.dataProvider?.uploadResults}
    {...props}
  />
)

export default withGlobalStore(rrsPolicy)
