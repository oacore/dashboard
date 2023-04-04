import React, { useState } from 'react'

import retrieveContent from '../../../content'

import { withGlobalStore } from 'store'
import SettingsTemplate from 'templates/settings'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const Settings = ({ store, ...restProps }) => {
  const [stateData, setStateData] = useState({})

  const setAssetsUrl = (object) => {
    Object.entries(object).forEach(([, value]) => {
      if (value.images) {
        Object.entries(value.images).forEach(([, item]) => {
          item.file = ASSETS_BASE_URL + item.file
        })
      }
      if (value.descriptionDashboard) {
        const regex = /({{\w+}})/g
        value.descriptionDashboard = value.descriptionDashboard.replace(regex)
      }
    })
  }

  const getSections = async ({ ref } = {}) => {
    const content = await retrieveContent('docs-membership', {
      ref,
      transform: 'object',
    })
    delete content.headerAbout
    Object.values(content).forEach((section) => {
      if (section.items) setAssetsUrl(section.items)
    })

    return content
  }
  if (Object.getOwnPropertyNames(stateData).length === 0) {
    getSections().then((val) => {
      setStateData(val)
    })
    return <></>
  }

  return (
    <SettingsTemplate
      userEmail={store.user.email}
      dataProvider={store.dataProvider}
      oaiMapping={store.dataProvider.oaiMapping}
      updateOrganization={store.updateOrganization}
      updateDataProvider={store.updateDataProvider}
      inviteUser={store.organisation.inviteUser}
      mappingSubmit={store.updateOaiSettings}
      updateLogo={store.updateLogo}
      organisationUserInvites={store.organisation.organisationUserInvites}
      delInviter={store.invitation?.deleteInviteUser}
      dataProviderLogo={store.dataProvider.logo}
      membershipPlan={store.dataProvider.membershipPlan}
      stateData={stateData}
      {...restProps}
    />
  )
}

export default withGlobalStore(Settings)
