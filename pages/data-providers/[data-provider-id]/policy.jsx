import React from 'react'

import { withGlobalStore } from '../../../store'
import RrsPageTemplate from '../../../templates/rrs-policy'

const PolicyPage = ({ store, ...props }) => (
  <RrsPageTemplate
    rrsList={store.dataProvider?.rrsList}
    getRrslistData={store.dataProvider?.getRrslistData}
    rrsAdditionalData={store.dataProvider?.rrsAdditionalData}
    getOutputsAdditionalData={store.dataProvider?.getOutputsAdditionalData}
    updateRrsStatus={store.dataProvider?.updateRrsStatus}
    statusUpdate={store.dataProvider?.statusUpdate}
    uploadPdf={store.dataProvider?.uploadPdf}
    uploadResults={store.dataProvider?.uploadResults}
    {...props}
  />
)

export default withGlobalStore(PolicyPage)
