import React from 'react'
import { Icon } from '@oacore/design'

import styles from './activity-select.css'

import { Drawer } from 'design'

const routes = [
  {
    activity: 'overview',
    icon: 'overview',
    title: 'Overview',
  },
  {
    activity: 'content',
    icon: 'data',
    title: 'Content',
  },
  {
    activity: 'deposit-dates',
    icon: 'data',
    title: 'Deposit dates',
  },
]

const ActivitySelect = passProps => (
  <Drawer.List {...passProps}>
    {routes.map(({ title, icon, activity }) => (
      <Drawer.Item key={activity} href={activity}>
        <Icon
          className={styles.itemIcon}
          alt={`${title} icon`}
          src={`/design/icons.svg#${icon}`}
        />
        {title}
      </Drawer.Item>
    ))}
  </Drawer.List>
)

export default ActivitySelect
