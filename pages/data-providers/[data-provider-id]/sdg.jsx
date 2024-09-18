import React from 'react'

import { withGlobalStore } from '../../../store'
import SdgPageTemplate from '../../../templates/sdg'

const SdgPage = ({ store, ...props }) => <SdgPageTemplate {...props} />

export default withGlobalStore(SdgPage)
