import React from 'react'
import { AppBar } from '@oacore/design'

import styles from './repository-select.css'

import { withGlobalStore } from 'store'
import { Select } from 'design'

const RepositorySelect = ({ store }) => (
  <AppBar.Item className={styles.container}>
    <Select
      id="repository"
      className={styles.repositorySelect}
      options={store.dataProviders.retrieveDataProviders}
      value={store.dataProviders.selectedProvider.name}
      onSelectionChange={v => {
        store.repository = v
        store.changeDataProvider(v.id)
      }}
      disabled={store.user.isAdmin}
    />
  </AppBar.Item>
)

export default withGlobalStore(RepositorySelect)
