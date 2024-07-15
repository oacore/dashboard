import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Switch } from '@oacore/design'

import styles from './styles.module.css'
import RadioGroup from '../checkbox/radiobutton'

const Notification = ({
  type,
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
  image,
}) => (
  <>
    <div className={styles.notificationContainer}>
      <div
        className={classNames.use({
          [styles.disabled]: notificationsPending || !notifications,
        })}
      >
        <Switch
          className={styles.toggler}
          id={id}
          checked={checked}
          nonActive={notificationsPending || !notifications}
          onChange={notificationsPending || !notifications ? null : onChange}
          label={label}
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
          />
        </div>
        <div>
          <img src={image} alt={type} />
        </div>
      </div>
    </div>
  </>
)

export default Notification
