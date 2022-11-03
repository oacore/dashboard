import React from 'react'

import HarvestingPageTemplate from 'templates/harvesting'
import { withGlobalStore } from 'store'

const HarvestingPage = ({ store: { dataProvider }, ...props }) => (
  <HarvestingPageTemplate
    harvestingStatus={dataProvider?.issues?.harvestingStatus}
    aggregation={dataProvider?.issues?.aggregation}
    issuesByType={dataProvider?.issues?.issuesByType}
    errorsCount={dataProvider?.issues?.aggregation?.errorsCount}
    warningCount={dataProvider?.issues?.aggregation?.warningsCount}
    metadataCount={dataProvider?.statistics?.countMetadata}
    fullTextCount={dataProvider?.statistics?.countFulltext}
    total={dataProvider?.issues?.aggregation?.total}
    {...props}
  />
)

export default withGlobalStore(HarvestingPage)
