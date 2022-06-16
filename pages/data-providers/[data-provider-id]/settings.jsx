import React from 'react'

import { withGlobalStore } from 'store'
import SettingsTemplate from 'templates/settings'

const Settings = ({ store, ...restProps }) => (
  <SettingsTemplate
    userEmail={store.user.email}
    dataProvider={store.dataProvider}
    oaiMapping={store.dataProvider.oaiMapping}
    updateOrganization={store.updateOrganization}
    updateDataProvider={store.updateDataProvider}
    inviteUser={store.organisation.inviteUser}
    mappingSubmit={store.updateOaiSettings}
    updateLogo={store.updateLogo}
    dataProviderLogo={store.dataProvider.logo}
    {...restProps}
  />
)

export default withGlobalStore(Settings)
