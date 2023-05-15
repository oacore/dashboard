import React from 'react'

import DeduplicationPageTemplate from '../../../templates/deduplication'

import { withGlobalStore } from 'store'

const DeduplicationPage = ({ store, ...props }) => (
  <DeduplicationPageTemplate
    deduplicationData={store.dataProvider?.deduplicationData}
    deduplicationInfo={store.dataProvider?.deduplicationInfo}
    outputsData={store.dataProvider?.outputsData}
    worksData={store.dataProvider?.worksData}
    updateWork={store.dataProvider?.updateWork}
    {...props}
  />
)

export default withGlobalStore(DeduplicationPage)
