import React from 'react'

import { withGlobalStore } from 'store'
import USRNTemplate from 'templates/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => (
  <USRNTemplate
    dataProviderName={dataProvider.name}
    billingPlan={organisation.billingPlan}
    dateReport="26.05.2024"
    doiCount={dataProvider?.doi?.originCount}
    totalDoiCount={dataProvider?.statistics?.countMetadata}
    {...props}
  />
)

export default withGlobalStore(USRNPage)
