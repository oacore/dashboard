import React from 'react'

import RepositoryPageTemplate from '../../../templates/settings/repository'

import { withGlobalStore } from 'store'

const RepositoryPage = ({ store, ...restProps }) => (
  <RepositoryPageTemplate
    membershipPlan={store.dataProvider.membershipPlan}
    updateOrganization={store.updateOrganization}
    dataProviderLogo={store.dataProvider.logo}
    updateDataProvider={store.updateDataProvider}
    updateLogo={store.updateLogo}
    setsList={store.setsList}
    loadingSets={store.loadingSets}
    enableSet={store.enableSet}
    getSetsEnabledList={store.getSetsEnabledList}
    enabledList={store.enabledList}
    disabledList={store.disabledList}
    deleteSet={store.deleteSet}
    getSetsWholeList={store.getSetsWholeList}
    wholeSetData={store.wholeSetData}
    loadingWholeSets={store.loadingWholeSets}
    loadingWholeSetsBtn={store.loadingWholeSetsBtn}
    setLoadingWholeSetsBtn={store.setLoadingWholeSetsBtn}
    loadingRemoveItem={store.loadingRemoveItem}
    setLoadingRemoveAction={store.setLoadingRemoveAction}
    oaiMapping={store.dataProvider.oaiMapping}
    setGlobalRorName={store.dataProvider.setGlobalRorName}
    setGlobalRorId={store.dataProvider.setGlobalRorId}
    mappingSubmit={store.updateOaiSettings}
    dataProvider={store.dataProvider}
    {...restProps}
  />
)
export default withGlobalStore(RepositoryPage)
