import React from 'react'

import { withGlobalStore } from 'store'
import RrsPageTemplate from 'templates/rrs-policy'

const rrsPolicy = ({ store, ...props }) => (
  <RrsPageTemplate
    rrsList={store.dataProvider?.rrsList}
    getRrslistData={store.dataProvider?.getRrslistData}
    articleAdditionalData={store.dataProvider?.articleAdditionalData}
    getOutputsAdditionalData={store.dataProvider?.getOutputsAdditionalData}
    rrsDataLoading={store.dataProvider?.rrsDataLoading}
    articleAdditionalDataLoading={
      store.dataProvider?.articleAdditionalDataLoading
    }
    rrsPdfLoading={store.dataProvider?.rrsPdfLoading}
    updateRrsStatus={store.dataProvider?.updateRrsStatus}
    rrsUrl={store.dataProvider?.rrsUrl}
    statusUpdate={store.dataProvider?.statusUpdate}
    uploadPdf={store.dataProvider?.uploadPdf}
    uploadResults={store.dataProvider?.uploadResults}
    billingPlan={store.organisation.billingPlan}
    dataProviderData={store.dataProvider}
    {...props}
  />
)

export default withGlobalStore(rrsPolicy)
