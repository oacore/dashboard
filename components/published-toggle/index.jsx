import React, { useState } from 'react'
import classNames from 'classnames'

import styles from './index.css'

const PublishedToggle = ({ defaultVisibility, isExpanded }) => {
  const [isChecked, toggleChecked] = useState(defaultVisibility)
  let toggletext = ''
  if (isExpanded) {
    if (isChecked) toggletext = 'Published'
    else toggletext = 'UnPublished'
  }

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={styles.toggle}
      onClick={event => {
        event.stopPropagation()
      }}
    >
      <input
        className={classNames(styles.toggleCheckbox, {
          [styles.expanded]: isExpanded,
        })}
        type="checkbox"
        onChange={event => {
          toggleChecked(event.target.checked)
        }}
        checked={isChecked}
      />
      <div className={styles.toggleSwitch}>
        <span>{toggletext}</span>
      </div>
    </label>
  )
}

export default PublishedToggle
