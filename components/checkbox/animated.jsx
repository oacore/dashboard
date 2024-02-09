import React, { useState } from 'react'

import styles from './styles.module.css'

function Checkbox({ subTitle }) {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={styles.checkboxInput}
      />
      <div
        className={`${styles.customCheckbox} ${
          isChecked ? styles.checked : ''
        }`}
      >
        <span className={styles.checkmark}>&#10003;</span>
      </div>
      <span className={styles.checkboxLabel}>{subTitle}</span>
    </label>
  )
}

export default Checkbox
