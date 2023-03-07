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
    organisationUserInvites={store.organisation.organisationUserInvites}
    mappingSubmit={store.updateOaiSettings}
    updateLogo={store.updateLogo}
    dataProviderLogo={store.dataProvider.logo}
    membershipPlan={store.dataProvider.membershipPlan}
    {...restProps}
  />
)

export default withGlobalStore(Settings)
