import React from 'react'
import { Switch } from '@oacore/design'

import RadioGroup from '../../../components/checkbox/radiobutton'
import styles from '../styles.module.css'
import deduplication from '../../../components/upload/images/deduplicationStatus.svg'

const DeduplicationNotification = ({
  label,
  title,
  options,
  checked,
  onChange,
  id,
  name,
  selectedOption,
  handleOptionChange,
  dataProviderId,
  deduplicationNotifications,
  // updateNotificationsPending,
  // deduplicationNotificationsPending,
}) => (
  <>
    <div className={styles.notificationContainer}>
      <div
      // className={classNames.use({
      //   [styles.disabled]: deduplicationNotificationsPending,
      // })}
      >
        <Switch
          className={styles.toggler}
          id={id}
          checked={checked}
          onChange={onChange}
          // onChange={deduplicationNotificationsPending ? null : onChange}
          label={label}
        />
      </div>
      <span className={styles.togglerText}>{title}</span>
      <div className={styles.cardWrapper}>
        <div>
          <RadioGroup
            onChange={handleOptionChange}
            selectedOption={selectedOption}
            options={options}
            name={name}
            dataProviderId={dataProviderId}
            checkedStatus={checked}
            notificationData={deduplicationNotifications}
            // updateNotificationsPending={updateNotificationsPending}
          />
        </div>
        <div>
          <img src={deduplication} alt="deduplication" />
        </div>
      </div>
    </div>
  </>
)

export default DeduplicationNotification
