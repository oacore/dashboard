import React from 'react'

import NotificationsPageTemplate from '../../../templates/settings/notifications'

import { withGlobalStore } from 'store'

const NotificationsPage = ({ store, ...restProps }) => (
  <NotificationsPageTemplate
    updateNotifications={store.updateNotifications}
    deleteNotifications={store.deleteNotifications}
    harvestNotifications={store.harvestNotifications}
    deduplicationNotifications={store.deduplicationNotifications}
    getNotifications={store.getNotifications}
    userId={store.user.id}
    organisationId={store.organisationId}
    toggleSwitch={store.toggleSwitch}
    switches={store.switches}
    dataProviderId={store.dataProvider.id}
    {...restProps}
  />
)
export default withGlobalStore(NotificationsPage)
