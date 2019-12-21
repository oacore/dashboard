import React, { useState } from 'react'
import { AppBar } from '@oacore/design'

import styles from './repository-select.css'

import { Select } from 'design'

// TODO: Move to @oacore/api
const fetchSuggestions = async term => {
  const r = await fetch(
    `https://api.core.ac.uk/internal/organisations?q=${term}`
  )
  return r.json()
}

const RepositorySelect = () => {
  const [repository, changeRepository] = useState({
    id: 1,
    name: 'Open Research Online',
  })

  return (
    <AppBar.Item className={styles.container}>
      <Select
        className={styles.repositorySelect}
        options={fetchSuggestions}
        value={repository.name}
        onSelectionChange={v => changeRepository(v)}
      />
    </AppBar.Item>
  )
}

export default RepositorySelect
