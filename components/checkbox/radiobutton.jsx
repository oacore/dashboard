import React from 'react'

import styles from './styles.module.css'

function RadioGroup({ options, selectedOption, onChange, name }) {
  return (
    <div className={styles.optionWrapper}>
      {options.map((item) => (
        <div className={styles.option} key={item}>
          <input
            className={styles.radioInput}
            name={name}
            type="radio"
            value={item}
            checked={selectedOption === item}
            onChange={() => onChange(item)}
          />
          <span className={styles.notificationTypeText}>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default RadioGroup
