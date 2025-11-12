import React from 'react'

import SwPageTemplate from '../../../templates/research-software'

import { withGlobalStore } from 'store'

const DasIdentifier = ({ store, ...props }) => <SwPageTemplate {...props} />

export default withGlobalStore(DasIdentifier)
