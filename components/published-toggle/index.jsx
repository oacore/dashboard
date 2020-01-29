import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const PublishedToggle = ({
  className,
  defaultVisibility,
  isExpanded,
  disabled,
}) => {
  const [isChecked, toggleChecked] = useState(defaultVisibility)
  let toggletext = ''
  if (isExpanded) {
    if (isChecked) toggletext = 'Published'
    else toggletext = 'UnPublished'
  }

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classNames
        .use(styles.toggle, {
          disabled,
        })
        .from(styles)}
      onClick={event => {
        event.stopPropagation()
      }}
    >
      <input
        className={classNames
          .use('toggle-checkbox', {
            expanded: isExpanded,
          })
          .from(styles)}
        type="checkbox"
        onChange={event => {
          if (disabled) return
          toggleChecked(event.target.checked)
        }}
        checked={disabled ? defaultVisibility : isChecked}
      />
      <div className={classNames.use('toggle-switch', className).from(styles)}>
        <span>{toggletext}</span>
      </div>
    </label>
  )
}

export default PublishedToggle
