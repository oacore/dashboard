import React from 'react'
import { AppBar } from '@oacore/design'

import styles from './repository-select.css'

import { withGlobalStore } from 'store'
import { Select } from 'design'

// TODO: Move to @oacore/api
const fetchSuggestions = async term => {
  const r = await fetch(
    `https://api.core.ac.uk/internal/organisations?q=${term}`
  )
  return r.json()
}

const RepositorySelect = ({ store }) => (
  <AppBar.Item className={styles.container}>
    <Select
      id="repository"
      className={styles.repositorySelect}
      options={fetchSuggestions}
      value={store.repository.name}
      onSelectionChange={v => {
        store.repository = v
        store.changeDataProvider(v.id)
      }}
    />
  </AppBar.Item>
)

export default withGlobalStore(RepositorySelect)
