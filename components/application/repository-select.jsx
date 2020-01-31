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
      options={searchTerm => store.user.searchDataProviders(searchTerm)}
      value={store.dataProvider.name}
      onSelectionChange={value => {
        store.changeDataProvider(value)
      }}
      disabled={store.user.dataProviders.length <= 1}
    />
  </AppBar.Item>
)

export default withGlobalStore(RepositorySelect)
