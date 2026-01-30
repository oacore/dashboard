import React from 'react'

import styles from './styles.module.css'

import { TextField } from 'design'

const DropdownInput = ({
  label,
  id,
  name,
  onChange,
  value,
  handleOptionClick,
  isOpen,
  suggestions,
  setRorId,
  setRorName,
  defaultValue,
  required,
}) => {
  const getRorDisplayName = (suggestion) => {
    if (!suggestion.names || !Array.isArray(suggestion.names))
      return suggestion.name || ''

    const rorDisplayName = suggestion.names.find(
      (nameItem) => nameItem.types && nameItem.types.includes('ror_display')
    )
    return rorDisplayName?.value || ''
  }

  const handleSuggestionClick = (suggestion) => {
    handleOptionClick()
    setRorId(suggestion.id)
    const rorName = getRorDisplayName(suggestion)
    setRorName(rorName)
  }

  return (
    <div className={styles.dropdownInput}>
      <TextField
        id={id}
        name={name}
        value={value}
        label={label}
        defaultValue={defaultValue}
        placeholder="Full name of your institution, e.g ‘The Open University’"
        className={styles.modalFormInputOrg}
        required={required}
        onChange={onChange}
      />
      {isOpen && (
        <div className={styles.dropdownOptions}>
          {suggestions?.map((suggestion, index) => (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <div
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              className={styles.dropdownOption}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {name === 'rorName'
                ? getRorDisplayName(suggestion)
                : suggestion.id}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropdownInput
