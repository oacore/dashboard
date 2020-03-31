import React from 'react'
import { observer } from 'mobx-react'

import styles from './styles.css'

import { withGlobalStore } from 'store'
import LoadingBar from 'components/loading-bar'

const LoadingBarController = ({ store }) =>
  store.isLoading ? <LoadingBar className={styles.loadingBar} /> : null

export default withGlobalStore(observer(LoadingBarController))
