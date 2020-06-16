import React from 'react'
import { LoadingBar } from '@oacore/design'

import { withGlobalStore } from 'store'

const LoadingBarController = ({ store, ...passProps }) =>
  store.isLoading ? <LoadingBar {...passProps} /> : null

export default withGlobalStore(LoadingBarController)
