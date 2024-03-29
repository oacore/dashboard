import React, { useState, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const RadioGroup = ({
  options,
  onChange,
  name,
  checkedStatus,
  notificationData,
  updateNotificationsPending,
}) => {
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    setSelectedOption(
      notificationData?.data[0]?.datetimeInterval || options[0].key
    )
  }, [notificationData, options])

  const handleRadioChange = (e) => {
    setSelectedOption(e.currentTarget.value)
    onChange(e.currentTarget.value)
  }

  return (
    <div className={styles.optionWrapper}>
      {options.map((item) => (
        <div className={styles.option} key={item.key}>
          {checkedStatus ? (
            <input
              className={classNames.use(styles.radioInput, {
                [styles.checked]: checkedStatus,
                [styles.disabledCursor]:
                  !checkedStatus ||
                  updateNotificationsPending ||
                  notificationData?.data.length < 1,
              })}
              name={name}
              type="radio"
              value={item.key}
              checked={notificationData ? selectedOption === item.key : false}
              onChange={handleRadioChange}
              disabled={
                !checkedStatus ||
                updateNotificationsPending ||
                notificationData?.data.length < 1
              }
            />
          ) : (
            <input
              disabled={
                !checkedStatus ||
                updateNotificationsPending ||
                notificationData?.data.length < 1
              }
              className={styles.radioInput}
              name={name}
              type="radio"
            />
          )}
          <span className={styles.notificationTypeText}>{item.title}</span>
        </div>
      ))}
    </div>
  )
}

export default RadioGroup
