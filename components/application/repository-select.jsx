import React from 'react'
import { AppBar } from '@oacore/design'
import Router from 'next/router'

import styles from './repository-select.module.css'

import { withGlobalStore } from 'store'
import { Select } from 'design'

const RepositorySelect = ({ store }) => (
  <AppBar.Item className={styles.container}>
    <Select
      id="repository"
      className={styles.repositorySelect}
      options={(searchTerm) => store.user.searchDataProviders(searchTerm)}
      value={store.dataProvider.name}
      onSelectionChange={(value) => {
        // provider is reflected to the store in app/index.jsx
        // - handleRouteChange
        Router.push(
          '/data-providers/[dataProviderId]/overview',
          `/data-providers/${value}/overview`
        )
      }}
      disabled={store.user.dataProviders.length <= 1}
    />
  </AppBar.Item>
)

export default withGlobalStore(RepositorySelect)
