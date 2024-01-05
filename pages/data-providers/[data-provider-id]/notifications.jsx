import React from 'react'

import NotificationsPageTemplate from '../../../templates/settings/notifications'

import { withGlobalStore } from 'store'

const NotificationsPage = () => <NotificationsPageTemplate />
export default withGlobalStore(NotificationsPage)
