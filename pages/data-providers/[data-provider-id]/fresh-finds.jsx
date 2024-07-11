import React from 'react'

import FreshFindsPageTemplate from '../../../templates/fresh-finds'
import { withGlobalStore } from '../../../store'

const FreshFindsPage = ({ store, ...props }) => (
  <FreshFindsPageTemplate
    getFreshFindsData={store.dataProvider?.getFreshFindsData}
    freshFindsData={store.dataProvider?.freshFindsData}
    freshFindsDataLoading={store.dataProvider?.freshFindsDataLoading}
    {...props}
  />
)

export default withGlobalStore(FreshFindsPage)
