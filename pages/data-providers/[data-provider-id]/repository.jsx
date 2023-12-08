import React from 'react'

import RepositoryPageTemplate from '../../../templates/settings/repository'

import { withGlobalStore } from 'store'

const RepositoryPage = ({ store, ...restProps }) => (
  <RepositoryPageTemplate
    membershipPlan={store.dataProvider.membershipPlan}
    updateOrganization={store.updateOrganization}
    dataProviderLogo={store.dataProvider.logo}
    fetchApiUsers={store.dataProvider.fetchApiUsers}
    fetchDatasetUsers={store.dataProvider.fetchDatasetUsers}
    updateDataProvider={store.updateDataProvider}
    updateLogo={store.updateLogo}
    oaiMapping={store.dataProvider.oaiMapping}
    apiUserData={store.dataProvider.apiUserData}
    datasetUserData={store.dataProvider.datasetUserData}
    setGlobalRorName={store.dataProvider.setGlobalRorName}
    setGlobalRorId={store.dataProvider.setGlobalRorId}
    mappingSubmit={store.updateOaiSettings}
    dataProvider={store.dataProvider}
    {...restProps}
  />
)
export default withGlobalStore(RepositoryPage)
