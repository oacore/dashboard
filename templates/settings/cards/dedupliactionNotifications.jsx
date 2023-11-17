import React from 'react'
import { Switch } from '@oacore/design'

import RadioGroup from '../../../components/checkbox/radiobutton'
import styles from '../styles.module.css'
import harvesting from '../../../components/upload/images/harvestingStatus.png'

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
}) => (
  <>
    <div className={styles.notificationContainer}>
      <Switch
        className={styles.toggler}
        id={id}
        checked={checked}
        onChange={onChange}
        label={label}
      />
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
          />
        </div>
        <div>
          <img src={harvesting} alt="harvesting" />
        </div>
      </div>
    </div>
  </>
)

export default DeduplicationNotification
