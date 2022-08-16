import React from 'react'

import MembershipPageTemplate from 'templates/membership'
import { withGlobalStore } from 'store'

const MembershipPage = ({ store: { dataProvider }, ...props }) => (
  <MembershipPageTemplate
    membershipPlan={dataProvider.membershipPlan}
    {...props}
  />
)

export default withGlobalStore(MembershipPage)
