import React from 'react'

import GeneralPageTemplate from '../../../templates/settings/general'

import { withGlobalStore } from 'store'

const GeneralPage = ({ store, ...restProps }) => (
  <GeneralPageTemplate
    userEmail={store.user.email}
    updateOrganization={store.updateOrganization}
    inviteUser={store.organisation.inviteUser}
    delInviter={store.invitation?.deleteInviteUser}
    organisationUserInvites={store.organisation.organisationUserInvites}
    apiUserData={store.dataProvider.apiUserData}
    datasetUserData={store.dataProvider.datasetUserData}
    fetchApiUsers={store.dataProvider.fetchApiUsers}
    fetchDatasetUsers={store.dataProvider.fetchDatasetUsers}
    {...restProps}
  />
)
export default withGlobalStore(GeneralPage)
