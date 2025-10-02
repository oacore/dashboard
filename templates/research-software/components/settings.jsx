import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Switch } from '@oacore/design'

import styles from './styles.module.css'
import RadioGroup from '../../../components/checkbox/radiobutton'

const NotificationToggler = ({
  label,
  title,
  options,
  checked,
  onChange,
  id,
  name,
  handleOptionChange,
  dataProviderId,
  notifications,
  updateNotificationsPending,
  notificationsPending,
}) => {
  const isDisabled = notificationsPending || !notifications

  const handleSwitchChange = (newChecked) => {
    if (!isDisabled) onChange(newChecked)
  }

  return (
    <>
      <div className={styles.notificationContainer}>
        <div
          className={classNames.use({
            [styles.disabled]: isDisabled,
          })}
        >
          <Switch
            className={styles.toggler}
            id={id}
            checked={checked}
            nonActive={isDisabled}
            onChange={isDisabled ? null : handleSwitchChange}
            label={label}
            disabled={isDisabled}
          />
        </div>
        <span className={styles.togglerText}>{title}</span>
        <div className={styles.cardWrapper}>
          <div>
            <RadioGroup
              onChange={handleOptionChange}
              options={options}
              name={name}
              dataProviderId={dataProviderId}
              checkedStatus={checked}
              notificationData={notifications}
              updateNotificationsPending={updateNotificationsPending}
              direction
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationToggler
