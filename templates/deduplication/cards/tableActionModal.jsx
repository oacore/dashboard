import React, { useState } from 'react'
import { Button } from '@oacore/design/src'

const ActionModal = ({ title, description, options, onConfirm, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState('')

  function handleOptionChange(event) {
    setSelectedOption(event.target.value)
  }

  function handleConfirm() {
    onConfirm(selectedOption)
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {options && (
        <div>
          {options.map((option) => (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label key={option.value}>
              {option.label}
              <input
                type="radio"
                name="option"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={handleOptionChange}
              />
            </label>
          ))}
        </div>
      )}
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  )
}

export default ActionModal
