import React from 'react'

import DasPageTemplate from '../../../templates/das'

import { withGlobalStore } from 'store'

const DasIdentifier = ({ store, ...props }) => (
  <DasPageTemplate
    dasList={store.dataProvider?.dasList}
    articleAdditionalData={store.dataProvider?.articleAdditionalData}
    getOutputsAdditionalData={store.dataProvider?.getOutputsAdditionalData}
    articleAdditionalDataLoading={
      store.dataProvider?.articleAdditionalDataLoading
    }
    billingPlan={store.organisation.billingPlan}
    dataProviderData={store.dataProvider}
    {...props}
  />
)

export default withGlobalStore(DasIdentifier)
