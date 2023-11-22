import React from 'react'
import { Switch } from '@oacore/design'

import RadioGroup from '../../../components/checkbox/radiobutton'
import styles from '../styles.module.css'
import harvesting from '../../../components/upload/images/harvestingStatus.svg'

const HarvestingNotification = ({
  label,
  title,
  options,
  checked,
  onChange,
  id,
  name,
  handleOptionChange,
  dataProviderId,
  harvestNotifications,
  // updateNotificationsPending,
  // harvestingNotificationsPending,
}) => (
  <>
    <div className={styles.notificationContainer}>
      <div
      // className={classNames.use({
      //   [styles.disabled]: harvestingNotificationsPending,
      // })}
      >
        <Switch
          className={styles.toggler}
          id={id}
          checked={checked}
          onChange={onChange}
          // onChange={harvestingNotificationsPending ? null : onChange}
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
            notificationData={harvestNotifications}
            // updateNotificationsPending={updateNotificationsPending}
          />
        </div>
        <div>
          <img src={harvesting} alt="harvesting" />
        </div>
      </div>
    </div>
  </>
)

export default HarvestingNotification
