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
      options={() => store.user.repositories}
      value={store.user.selectedRepository.name}
      onSelectionChange={v => {
        store.repository = v
        store.changeDataProvider(v.id)
      }}
      disabled={store.user.repositories.length <= 1}
    />
  </AppBar.Item>
)

export default withGlobalStore(RepositorySelect)
