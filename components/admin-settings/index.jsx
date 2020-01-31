import React from 'react'

import styles from './styles.css'
import profiles from '../../profiles'

import { Icon } from 'design'
import { withGlobalStore } from 'store'

const AdminSettings = ({ store }) => (
  <div className={styles.slideout}>
    <Icon className={styles.slideoutIcon} src="/design/icons.svg#settings" />
    <div className={styles.slideoutInner}>
      {Object.entries(profiles).map(([id, { name }]) => (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className={styles.radioContainer}>
          {name}
          <input
            id={`profile-${id}`}
            type="radio"
            name="profile"
            value={id}
            checked
            onClick={e => store.changeProfile(e.target.value)}
          />
          <span className={styles.checkBox} />
        </label>
      ))}
    </div>
  </div>
)

export default withGlobalStore(AdminSettings)
