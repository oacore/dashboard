import React from 'react'

import IssuesTemplate from 'templates/issues'
import { withGlobalStore } from 'store'

const Issues = ({ store: { dataProvider }, ...props }) => (
  <IssuesTemplate
    harvestingStatus={dataProvider?.issues.harvestingStatus}
    aggregation={dataProvider?.issues.aggregation}
    pages={dataProvider?.issues.issues}
    {...props}
  />
)

export default withGlobalStore(Issues)
