import React from 'react'

import { withGlobalStore } from 'store'
import USRNTemplate from 'templates/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => {
  const usrnParams = {
    dataProviderName: dataProvider.name,
    billingPlan: organisation.billingPlan,
    dateReport: '26.05.2024',
    doiCount: dataProvider?.doi?.originCount,
    totalDoiCount: dataProvider?.statistics?.countMetadata,
    countMetadata: dataProvider?.statistics?.countMetadata,
    statisticsIrus: dataProvider?.irus,
  }
  return <USRNTemplate usrnParams={usrnParams} {...props} />
}

export default withGlobalStore(USRNPage)
