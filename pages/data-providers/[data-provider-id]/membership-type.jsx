import React from 'react'

import MembershipPageTemplate from '../../../templates/membership/membershipType'

import { withGlobalStore } from 'store'

const MembershipTypePage = ({ store: { dataProvider }, ...props }) => (
  <MembershipPageTemplate
    membershipPlan={dataProvider.membershipPlan}
    {...props}
  />
)

export default withGlobalStore(MembershipTypePage)
