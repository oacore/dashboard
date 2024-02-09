import React from 'react'

import { withGlobalStore } from '../../../store'
import RrsPageTemplate from '../../../templates/rrs-policy'

const PolicyPage = ({ store, ...props }) => <RrsPageTemplate {...props} />

export default withGlobalStore(PolicyPage)
