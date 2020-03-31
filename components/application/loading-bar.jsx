import React from 'react'

import { withGlobalStore } from 'store'
import LoadingBar from 'components/loading-bar'

const LoadingBarController = ({ store, ...passProps }) =>
  store.isLoading ? <LoadingBar {...passProps} /> : null

export default withGlobalStore(LoadingBarController)
