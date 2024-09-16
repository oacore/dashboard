import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react'
import { AppBar, Select } from '@oacore/design'
import { useRouter } from 'next/router'
import { classNames } from '@oacore/design/lib/utils'

import styles from './repository-select.module.css'
import { TextField } from '../../design'

import close from 'components/upload/assets/closeLight.svg'
import folder from 'components/upload/assets/folder.svg'
import dropdown from 'components/upload/assets/dropdownArrow.svg'
import { GlobalContext, withGlobalStore } from 'store'

const RepositorySelect = ({ store }) => {
  const router = useRouter()
  const { ...globalStore } = useContext(GlobalContext)
  const [suggestions, setSuggestions] = useState(store.user.dataProviders)
  const [value, setValue] = useState(store.dataProvider.name)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [inputValue, setInputValue] = useState('')
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
      store.updateSelectedSetSpec(null)
      store.updateSelectedSetName(null)
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
    setInputValue(item.setNameDisplay)
    store.updateSelectedSetSpec(item.setSpec)
    store.updateSelectedSetName(item.setNameDisplay)
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
    store.getSetsEnabledList(providerId)
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

  const handleClear = () => {
    setSelectedItem(null)
    setInputValue('')
    store.updateSelectedSetSpec(null)
    store.updateSelectedSetName(null)
    store.dataProvider?.getDeduplicationData(providerId)
    store.dataProvider?.getRrslistData(providerId)
    store.dataProvider?.doi?.doiRecords.load()
    store.dataProvider.works.resetWorks()
    store.dataProvider.depositDates.resetCompliance()
    store.dataProvider.doi.resetDoiRecords()
    store.dataProvider?.depositDates?.publicReleaseDatesPages?.load()
    store.dataProvider.retrieve()
  }

  const handleSetInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const filteredData = store.enabledList.filter((item) =>
    item.setNameDisplay.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <AppBar.Item className={styles.container}>
      <Select
        id="repository"
        className={styles.repositorySelect}
        label="Repository"
        value={value.length > 100 ? `${value.substring(0, 110)}...` : value}
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
      {store.enabledList.length > 0 && globalStore.dataProvider.id === 140 && (
        <div className={styles.dropdownMenuWrapper} ref={setsRef}>
          <div className={styles.selectFormWrapper}>
            <div className={styles.selectWrapper}>
              {selectedItem ? (
                <div className={styles.selectedItem}>
                  {selectedItem?.setNameDisplay.length > 30
                    ? `${selectedItem?.setNameDisplay.substring(0, 30)}...`
                    : inputValue}
                  {/* eslint-disable-next-line max-len */}
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                  <img
                    className={styles.closeIcon}
                    onClick={handleClear}
                    src={close}
                    alt="close"
                  />
                </div>
              ) : (
                <div className={styles.dropdownSecondWrapper}>
                  <img
                    className={styles.folderIcon}
                    src={folder}
                    alt="dropdown"
                  />
                  <div
                    className={classNames.use(styles.activeWrapper, {
                      [styles.active]: isOpen,
                    })}
                  >
                    <TextField
                      id="secondInput"
                      label="Sets"
                      onClick={handleDropdownClick}
                      onChange={handleSetInputChange}
                      value={inputValue}
                      className={styles.selectInput}
                    />
                    <img
                      className={styles.icon}
                      src={dropdown}
                      alt="dropdown"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {isOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                {filteredData.map((item) => (
                  // eslint-disable-next-line max-len
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={styles.selectItem}
                  >
                    {item.setNameDisplay}
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
