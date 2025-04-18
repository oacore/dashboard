import React from 'react'

import { withGlobalStore } from '../../../store'
import SdgPageTemplate from '../../../templates/sdg'

const SdgPage = ({ store, ...props }) => (
  <SdgPageTemplate
    sdgUrl={store.dataProvider?.sdgUrl}
    getSdgTableData={store.dataProvider?.getSdgTableData}
    getSdgYearData={store.dataProvider?.getSdgYearData}
    generateSdgReport={store.dataProvider?.generateSdgReport}
    sdgTableList={store.dataProvider?.sdgTableList}
    sdgYearData={store.dataProvider?.sdgYearData}
    sdgTableDataLoading={store.dataProvider?.sdgTableDataLoading}
    articleAdditionalData={store.dataProvider?.articleAdditionalData}
    billingPlan={store.organisation.billingPlan}
    articleAdditionalDataLoading={
      store.dataProvider?.articleAdditionalDataLoading
    }
    sdgYearDataLoading={store.dataProvider?.sdgYearDataLoading}
    {...props}
  />
)

export default withGlobalStore(SdgPage)
