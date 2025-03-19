import React from 'react'

import OrcidPageTemplate from '../../../templates/orcid'

import { withGlobalStore } from 'store'

const OrcidPage = ({ store, ...props }) => <OrcidPageTemplate {...props} />

export default withGlobalStore(OrcidPage)
