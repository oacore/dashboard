import React from 'react'

import MembershipPageTemplate from 'templates/membership'
import { withGlobalStore } from 'store'

const MembershipPage = ({ store: { organisation }, ...props }) => (
  <MembershipPageTemplate
    membershipPlan={organisation.billingPlan}
    {...props}
  />
)

export default withGlobalStore(MembershipPage)
