import React, { useEffect, useState, useCallback } from 'react'
import { Select as DesignSelect } from '@oacore/design'

const Select = ({ options, label, placeholder, onOptionSelected }) => {
  const [selectValue, setSelectValue] = useState('')
  const [suggestions, setSuggestions] = useState(options)

  const getOptions = useCallback(
    (searchTerm) =>
      options.filter(
        (el) => el.value.toLowerCase().search(searchTerm?.toLowerCase()) !== -1
      ),

    [options]
  )

  const handleOnInput = useCallback((selectData) => {
    if (selectData.id == null) setSuggestions(getOptions(selectData.value))
    setSelectValue(selectData.value)
  }, [])

  const handleOnChange = useCallback((selectData) => {
    if (selectData.id == null) setSelectValue('')
    else onOptionSelected(selectData.id)
  }, [])

  useEffect(() => {
    setSuggestions(getOptions(selectValue))
  }, [options])

  return (
    <DesignSelect
      value={selectValue}
      onInput={handleOnInput}
      onChange={handleOnChange}
      label={label}
      placeholder={placeholder}
      clearOnFocus
    >
      {suggestions.map((el) => (
        <DesignSelect.Option key={el.id} id={el.id} value={el.value}>
          {el.value}
        </DesignSelect.Option>
      ))}
    </DesignSelect>
  )
}

export default Select
