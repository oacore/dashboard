import React, { useCallback, useState, useEffect } from 'react'
import { AppBar, Select } from '@oacore/design'
import { useRouter } from 'next/router'

import styles from './repository-select.module.css'

import { withGlobalStore } from 'store'

const RepositorySelect = ({ store }) => {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState(store.user.dataProviders)
  const [value, setValue] = useState(store.dataProvider.name)

  const handleOnChange = useCallback(
    (data) => {
      if (data.value === store.dataProvider.name) return
      if (!data.id) {
        setValue(store.dataProvider.name)
        return
      }
      const routePath = '/data-providers/[data-provider-id]'
      const actualPath = `/data-providers/${data.id}`

      router.push(routePath, actualPath)
    },
    [router, store.dataProvider.name]
  )

  const getOptions = useCallback(
    (searchTerm) => store.user.searchDataProviders(searchTerm),
    [store.user]
  )

  const handleOnInput = useCallback((data) => {
    if (!data.id) setSuggestions(getOptions(data.value))
    setValue(data.value)
  }, [])

  useEffect(() => {
    setValue(store.dataProvider.name)
  }, [store.dataProvider.name])

  return (
    <AppBar.Item className={styles.container}>
      <Select
        id="repository"
        className={styles.repositorySelect}
        label="Repository"
        value={value}
        onInput={handleOnInput}
        onChange={handleOnChange}
        placeholder="Search repositories"
        clearButton={false}
        clearOnFocus
        spellCheck={false}
        variant="pure"
      >
        {suggestions.map((el) => (
          <Select.Option key={el.id} id={el.id} value={el.name}>
            {el.name}
          </Select.Option>
        ))}
      </Select>
    </AppBar.Item>
  )
}

export default withGlobalStore(RepositorySelect)
