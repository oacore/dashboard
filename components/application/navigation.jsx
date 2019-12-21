import React from 'react'
import { Icon } from '@oacore/design'

import styles from './navigation.css'

import { Drawer } from 'design'

const Navigation = ({ children, ...passProps }) => (
  <Drawer.List {...passProps}>{children}</Drawer.List>
)

const NavigationItem = ({ children, href }) => (
  <Drawer.Item href={href}>{children}</Drawer.Item>
)

Navigation.Item = NavigationItem

const titleMap = {
  overview: 'Overview',
  data: 'Data',
  'deposit-dates': 'Deposit dates',
  statistics: 'Statistics',
  plugins: 'Plugins',
  settings: 'Settings',
}

const captions = Object.fromEntries(
  [
    'overview',
    'data',
    'deposit-dates',
    'statistics',
    'plugins',
    'settings',
  ].map(activity => [
    activity,
    <>
      <Icon
        className={styles.itemIcon}
        src={`/design/icons.svg#${activity}Ч`}
        alt
        aria-hidden
      />
      {titleMap[activity]}
    </>,
  ])
)

export default Navigation
export { NavigationItem, captions }
