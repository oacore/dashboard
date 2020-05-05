import React, { useCallback } from 'react'
import { AppBar } from '@oacore/design'
import { useRouter } from 'next/router'

import styles from './repository-select.module.css'

import { withGlobalStore } from 'store'
import { Select } from 'design'

const RepositorySelect = ({ store }) => {
  const router = useRouter()
  const handleChange = useCallback(
    (value) => {
      const routePath = '/data-providers/[data-provider-id]'
      const actualPath = `/data-providers/${value}`

      router.push(routePath, actualPath)
    },
    [router]
  )

  const getOptions = useCallback(
    (searchTerm) => store.user.searchDataProviders(searchTerm),
    [store.user]
  )

  return (
    <AppBar.Item className={styles.container}>
      <Select
        id="repository"
        className={styles.repositorySelect}
        options={getOptions}
        value={store.dataProvider.name}
        onSelectionChange={handleChange}
        disabled={store.dataProviders.length <= 1}
        label="Select repository"
        labelSrOnly
      />
    </AppBar.Item>
  )
}

export default withGlobalStore(RepositorySelect)
