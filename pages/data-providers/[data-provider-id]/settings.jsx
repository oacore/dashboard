import React from 'react'

import { withGlobalStore } from 'store'
import SettingsTemplate from 'templates/settings'

const Settings = ({ store, ...restProps }) => (
  <SettingsTemplate
    userEmail={store.user.email}
    dataProvider={store.dataProvider}
    updateOrganization={store.updateOrganization}
    updateDataProvider={store.updateDataProvider}
    inviteUser={store.organisation.inviteUser}
    {...restProps}
  />
)

export default withGlobalStore(Settings)
