import React from 'react'

import { withGlobalStore } from 'store'
import DoiTemplate from 'templates/doi'

const DoiPage = ({ store: { dataProvider }, ...props }) => (
  <DoiTemplate
    enrichmentSize={dataProvider?.doi?.enrichmentSize}
    doiUrl={dataProvider?.doi?.doiUrl}
    isExportDisabled={
      dataProvider?.doi?.enrichmentSize === 0 ||
      dataProvider?.doi?.doiRecords.error != null ||
      dataProvider?.doi?.doiRecords.data.length === 0
    }
    doiCount={dataProvider?.doi?.originCount}
    dataProviderName={dataProvider.name}
    doiRecords={dataProvider?.doi?.doiRecords}
    membershipPlan={dataProvider?.membershipPlan}
    totalCount={dataProvider?.statistics?.metadataCount}
    {...props}
  />
)

export default withGlobalStore(DoiPage)
