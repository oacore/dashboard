import React, { useState } from 'react'
import { Switch } from '@oacore/design'

import { Checkbox } from '../../../components/checkbox'
import RadioGroup from '../../../components/checkbox/radiobutton'
import styles from '../styles.module.css'
import harvesting from '../../../components/upload/images/harvestingStatus.png'

const Notification = ({
  label,
  title,
  subTitle,
  options,
  checked,
  onChange,
  id,
  name,
}) => {
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (newSelectedOption) => {
    setSelectedOption(newSelectedOption)
  }
  return (
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
            <div className={styles.typeWrapper}>
              <Checkbox id="harvestingletter" subTitle={subTitle} />
            </div>
            <RadioGroup
              onChange={handleOptionChange}
              selectedOption={selectedOption}
              options={options}
              name={name}
            />
          </div>
          <div>
            <img src={harvesting} alt="harvesting" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Notification
