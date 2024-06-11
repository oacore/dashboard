import React, { useCallback, useState, useEffect, useRef } from 'react'
import { AppBar, Select } from '@oacore/design'
import { useRouter } from 'next/router'

import styles from './repository-select.module.css'
import { TextField } from '../../design'

import close from 'components/upload/assets/closeLight.svg'
import { withGlobalStore } from 'store'

const RepositorySelect = ({ store }) => {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState(store.user.dataProviders)
  const [value, setValue] = useState(store.dataProvider.name)
  const [showSecondDropdown, setShowSecondDropdown] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const providerId = router.query['data-provider-id']
  const setsRef = useRef(null)

  const handleOnChange = useCallback(
    (data) => {
      if (!data.id) {
        setValue(store.dataProvider.name)
        return
      }
      const routePath = '/data-providers/[data-provider-id]'
      const actualPath = `/data-providers/${data.id}`

      router.push(routePath, actualPath)
      setShowSecondDropdown(true)
      store.updateSelectedSetSpec(null)
    },
    [router, store.dataProvider.name]
  )

  const getOptions = useCallback(
    (searchTerm) => store.searchDataProviders(searchTerm),
    [store]
  )

  const handleOnInput = useCallback((data) => {
    if (!data.id) setSuggestions(getOptions(data.value))
    setValue(data.value)
  }, [])

  const handleDropdownClick = async () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (item) => {
    setSelectedItem(item)
    setIsOpen(false)
    store.updateSelectedSetSpec(item.setSpec)
    store.dataProvider?.getDeduplicationData(providerId)
    store.dataProvider?.getRrslistData(providerId)
    store.dataProvider?.doi?.doiRecords.load()
    store.dataProvider.works.resetWorks()
    store.dataProvider.depositDates.resetCompliance()
    store.dataProvider.doi.resetDoiRecords()
    store.dataProvider?.depositDates?.publicReleaseDatesPages?.load()
    store.dataProvider.retrieve()
  }

  useEffect(() => {
    store.getSetsEnabledList()
  }, [providerId])

  useEffect(() => {
    setValue(store.dataProvider.name)
  }, [store.dataProvider.name])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (setsRef.current && !setsRef.current.contains(event.target))
        setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setsRef])

  const handleSelectClick = () => {
    if (value === store.dataProvider.name) setShowSecondDropdown(true)
  }

  const handleClear = () => {
    // eslint-disable-next-line no-console
    console.log('reset')
  }

  return (
    <AppBar.Item className={styles.container}>
      <Select
        id="repository"
        className={styles.repositorySelect}
        label="Repository"
        value={value.length > 100 ? `${value.substring(0, 110)}...` : value}
        onInput={handleOnInput}
        onChange={handleOnChange}
        onClick={handleSelectClick}
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
      {store.enabledList.length > 0 && showSecondDropdown && (
        <div className={styles.dropdownMenuWrapper} ref={setsRef}>
          <div className={styles.selectFormWrapper}>
            <div className={styles.selectWrapper}>
              {selectedItem ? (
                <div className={styles.selectedItem}>
                  {selectedItem.setName}
                  {/* eslint-disable-next-line max-len */}
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                  <img onClick={handleClear} src={close} alt="close" />
                </div>
              ) : (
                <TextField
                  id="secondInput"
                  label="Sets"
                  onClick={handleDropdownClick}
                  readOnly
                  value={selectedItem ? selectedItem.setName : ''}
                  className={styles.selectInput}
                />
              )}
            </div>
          </div>
          {isOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                {store.enabledList.map((item) => (
                  // eslint-disable-next-line max-len
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={styles.selectItem}
                  >
                    {item.setName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </AppBar.Item>
  )
}

export default withGlobalStore(RepositorySelect)
