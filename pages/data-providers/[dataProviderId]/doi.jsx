import React from 'react'

import { withGlobalStore } from 'store'
import DoiTemplate from 'templates/doi'

const DoiPage = ({ store, ...props }) => (
  <DoiTemplate
    enrichmentSize={store.doi.enrichmentSize}
    doiUrl={store.doi.doiUrl}
    isExportDisabled={store.doi.isExportDisabled}
    doiCount={store.doi.originCount}
    dataProviderName={store.dataProvider.name}
    doiRecords={store.doi.doiRecords}
    {...props}
  />
)

export default withGlobalStore(DoiPage)
