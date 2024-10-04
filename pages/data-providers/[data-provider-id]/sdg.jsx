import React from 'react'

import { withGlobalStore } from '../../../store'
import SdgPageTemplate from '../../../templates/sdg'

const SdgPage = ({ store, ...props }) => {
  const dataProviderId = store.dataProvider?.id

  if (dataProviderId !== 86) return null

  return (
    <SdgPageTemplate
      sdgUrl={store.dataProvider?.sdgUrl}
      getSdgTableData={store.dataProvider?.getSdgTableData}
      getSdgYearData={store.dataProvider?.getSdgYearData}
      sdgTableList={store.dataProvider?.sdgTableList}
      sdgYearData={store.dataProvider?.sdgYearData}
      sdgTableDataLoading={store.dataProvider?.sdgTableDataLoading}
      articleAdditionalData={store.dataProvider?.articleAdditionalData}
      articleAdditionalDataLoading={
        store.dataProvider?.articleAdditionalDataLoading
      }
      sdgYearDataLoading={store.dataProvider?.sdgYearDataLoading}
      {...props}
    />
  )
}

export default withGlobalStore(SdgPage)
