import React from 'react'

import { withGlobalStore } from 'store'
import USRNTemplate from 'templates/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => (
  <USRNTemplate
    dataProviderName={dataProvider.name}
    billingPlan={organisation.billingPlan}
    {...props}
  />
)

export default withGlobalStore(USRNPage)
