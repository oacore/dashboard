import React from 'react'

import IssuesTemplate from 'templates/issues'
import { withGlobalStore } from 'store'

const Issues = ({ store, ...props }) => (
  <IssuesTemplate
    harvestingStatus={store.issues.harvestingStatus}
    aggregation={store.issues.aggregation}
    pages={store.issues.issues}
    {...props}
  />
)

export default withGlobalStore(Issues)
