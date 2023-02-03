import React from 'react'

import MembershipPageTemplate from 'templates/membership'
import { withGlobalStore } from 'store'

const MembershipPage = ({
  store: { dataProvider, organisation },
  ...props
}) => (
  <MembershipPageTemplate
    membershipPlan={organisation.billingPlan}
    dataProviderId={dataProvider.id}
    {...props}
  />
)

export default withGlobalStore(MembershipPage)
